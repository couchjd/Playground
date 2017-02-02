/*
 *  libsoy - soy.scenes.Scene
 *  Copyright (C) 2006-2014 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    GLib
    GLib.Math
    GL
    Gee
    ode

GeomScene   : ulong = 1
GeomBody    : ulong = 2
GeomField   : ulong = 4
GeomLight   : ulong = 8
GeomGhost   : ulong = 16
GeomTestRay : ulong = 32
GeomIgnored : ulong = 64

MAX_RENDER_LEVEL : int = 1

class soy.scenes.Scene : Object
    collide_glslv : static extern string
    collide_glslf : static extern string
    skybox_glslv : static extern string
    skybox_glslf : static extern string

    space : ode.spaces.Space
    _contactGroup : ode.joints.JointGroup
    _lastStep : uint64
    _tv : TimeVal
    lights : Gee.HashSet of soy.bodies.Light
    bodies : dict of string, soy.bodies.Body
    joints : list of soy.joints.Joint
    Controllers : Gee.HashSet of soy.controllers.VirtualController
    fields : dict of ode.Body,soy.fields.Field
    _callFields : LinkedList of soy.fields.Field
    _giveFields : LinkedList of soy.fields.Field
    _skybox : soy.textures.Cubemap
    _skybox_updated : bool // do the skybox buffers need to be updated?
    _ebo    : GLuint
    _vbo    : GLuint
    tslvs : array of GLfloat
    _col_texture : GLuint
    _col_out_texture : GLuint
    _col_texels : GLfloat*
    _col_data : GLubyte*
    _col_fbo : GLuint
    _col_vbo : GLuint
    mutex : Mutex

    init
        mutex = Mutex()

    //
    // Class constructor
    init static
        if soy.scenes._thread is null
            soy.scenes._thread = new soy.scenes._PhysicsThread()


    //
    // Instance constructor
    construct ()
        bodies = new dict of string, soy.bodies.Body
        lights = new Gee.HashSet of soy.bodies.Light
        joints = new list of soy.joints.Joint
        Controllers = new Gee.HashSet of soy.controllers.VirtualController
        fields = new dict of unowned ode.Body,soy.fields.Field
        _callFields = new LinkedList of soy.fields.Field
        _giveFields = new LinkedList of soy.fields.Field
        _ambient = new array of GLfloat[4] = {0.5f, 0.5f, 0.5f, 1.0f}
        _fog = new array of GLfloat[4] = {0.0f, 0.0f, 0.0f, 0.0f}
        space = new ode.spaces.Space( null )
        _contactGroup = new ode.joints.JointGroup(0)
        _ebo = 0 // for first pass checking
        _skybox = null
        _skybox_updated = true
        _col_texels = malloc(sizeof(GLfloat) * 4 * 16)
        _col_data = malloc(sizeof(GLubyte) * 4 * 256)
        self.rotation = new array of GLfloat[9] = {1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f}
        self.position = new soy.atoms.Position()

        // Get current time
        // Note: Any information more precise than milliseconds is lost
        _tv = GLib.TimeVal()
        _time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
        _lastStep = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000

        // Add timeout callback
        var source = new TimeoutSource(10)
        source.set_callback ((GLib.SourceFunc) self.step )
        source.attach(soy.scenes._thread.context)

        // Set gravity
        _gravity = new soy.atoms.Vector(0.0f, 0.0f, 0.0f)

    //
    // Mapping
    def new get (key : string) : soy.bodies.Body?
        res : soy.bodies.Body? = null
        mutex.lock()
        if key in bodies.keys
            res = bodies[key]
        mutex.unlock()
        return res


    def has_key (key : string) : bool
        res : bool
        mutex.lock()
        res = bodies.has_key(key)
        mutex.unlock()
        return res


    def new set (key : string, value : soy.bodies.Body?)
        mutex.lock()
        _stepLock.writer_lock()
        body_update(key, value)
        bodies[key] = value
        value.add(key, self)
        _stepLock.writer_unlock()
        mutex.unlock()
        
        
    def delete (key : string)
        mutex.lock()
        body_remove(key)
        bodies.unset(key)
        mutex.unlock()

    // Overridable method for subclasses to do something when a body is added/changed.
    def virtual body_update (key : string, value : soy.bodies.Body?)
        pass

    // Overridable method for subclasses to do something when a body is added/changed.
    def virtual body_remove (key : string)
        pass

    //
    // Scene Callbacks
    def _collided (geomA : geoms.Geom, geomB : geoms.Geom) : void
        numberOfContacts : int
        contactGeoms : ode.ContactGeomArray* = new ode.ContactGeomArray(4)
        bodyA : unowned ode.Body? = null
        bodyB : unowned ode.Body? = null
        contact : ode.Contact = ode.Contact()

        // Get Contact Geoms
        //
        // We ask ODE for up to 4 contact points between the two geoms.
        numberOfContacts = geomA.Collide(geomB, 4,
                                         contactGeoms,
                                         (int) sizeof(ode.ContactGeom))

        // This callback may be called when two objects are near each other
        // but not actually touching.  In this case we test for actual contacts
        // above and then return if none are found.
        if numberOfContacts == 0
            return

        // Scene Check
        //
        // Geoms are either associated with a scene (ie, the ground) or a body.
        // When a body collides with a scene (ie, tire on ground), only the
        // body moves in reaction (the tire can't move the ground) so the
        // resulting Contact joint is between the body and NULL.
        //
        // Geoms associated with a scene are flagged with GeomScene to mark
        // this condition, otherwise they're assumed to have an attached body.
        if geomA.GetCategoryBits() != GeomScene
            bodyA = geomA.GetBody()
        if geomB.GetCategoryBits() != GeomScene
            bodyB = geomB.GetBody()

        // Ghost Check
        //
        // A "ghost" is a body who's movement is constrained by the the scene
        // and other bodies in the scene, but who cannot effect other bodies
        // in the scene.
        //
        // An example would be an invisible camera in the scene.  You wouldn't
        // want the camera ending up inside an object or terrain, but it also
        // shouldn't be able to move objects it bumps into.
        //
        // To accomplish this, we change the Body its colliding with to NULL
        // so that the "ghost" object is colliding against an immovable point
        // in the scene rather than the other body.
        if geomA.GetCategoryBits() == GeomGhost
            bodyB = null
        if geomB.GetCategoryBits() == GeomGhost
            bodyA = null

        // If both bodies are NULL (ie, Ghost-Ghost collision) just return now.
        if bodyA == bodyB
            return

        // Add bodies to callFields.
        if self.fields.has_key(bodyA)
            self._callFields.add(self.fields[bodyA])
        if self.fields.has_key(bodyB)
            self._callFields.add(self.fields[bodyB])

        // Create Contact Joints
        //
        // So we're working with a few things here.  To start, we have the
        // array of ContactGeoms.  Each ContactGeom represents a different
        // point of contact between these two bodies and will result in its
        // own Contact joint.
        //
        // In order to create these Contact joints we need to setup a struct
        // we call "contact" which holds a copy of the ContactGeom and surface
        // parameters such as how much friction it applies and how much bounce
        // it has to it.
        //
        // Once the "contact" struct is finished we create a new Contact joint
        // and add it to our _contactGroup which is reset after each step, then
        // attach it to bodyA and bodyB as determined above.
        //
        // TODO surface parameters should come from the Shape, not hard-coded!
        numberOfContacts -= 1
        for var i = 0 to numberOfContacts
            contact.geom = contactGeoms->get(i)
            contact.surface.mode = ode.contacts.Bounce
            contact.surface.mu = (Real) 0.0
            contact.surface.bounce = (Real) 0.8
            contact.surface.bounce_vel = (Real) 0.0
            joint : ode.joints.Contact* = new ode.joints.Contact(_world,
                                                                 _contactGroup,
                                                                 contact)
            joint->Attach(bodyA, bodyB)
        return

    // Scene Methods
    def step () : bool
        self._callFields.clear()
        self._giveFields.clear()

        mutex.lock()
        for field in self.fields.values
            // Make sure every field is in givefields & give each one
            if not self._giveFields.contains(field)
                field.give(0)
                self._giveFields.add(field)

        for field in self.fields.values
            // Apply fields; add incompletely applied fields to the list
            if not field.apply()
                self._callFields.add(field)

        // Apply any outstanding fields
        for field in self._callFields
            field.commit()

        var finished_controllers = new Gee.LinkedList of soy.controllers.VirtualController()

        // Apply gravity
        for body in self.bodies.values
            m : float = body.density * body.volume()
            body.addForce(m*self._gravity.x, m*self._gravity.y,m*self._gravity.z)

        // Get current time
        _tv.get_current_time()
        self._time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
        var steps = GLib.Math.lround((self.time - _lastStep)/10)
        _lastStep = self._time
        _stepLock.writer_lock()
        for var i = 0 to steps
            _tv.get_current_time()
            self._time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
            self.do_in_step()
            // apply gravity
            //for body in self.bodies.values
            //    m : float = body.density * body.volume()
            //    body.addForce(m*self._gravity.x, m*self._gravity.y,m*self._gravity.z)
            for field in self._giveFields
                field.give(1)
            self._callFields.clear()
            for cont in self.Controllers
                cont.run_controller()
                if cont.finished
                    finished_controllers.add(cont)
            self.Controllers.remove_all(finished_controllers)
            finished_controllers.clear()

            space.Collide(self._collided)
            // FIXME QuickStep needs to be run once for all scenes
            // FIXME changing that will require refactoring this method
            _world.QuickStep(0.01f)
            _contactGroup.Empty()
            if i != 0
                for field in self._callFields
                    field.give(0)
        _stepLock.writer_unlock()
        
        mutex.unlock()
        return true


    // Overridable method for subclasses to do something inside step-method.
    def virtual do_in_step ()
        pass

    def virtual collide(x: int, y : int, width : int, height : int)
        if _col_texture is 0
            textures : array of GLuint = {0, 0}
            glGenTextures(textures)
            _col_texture = textures[0]
            _col_out_texture = textures[1]
            framebuffers : array of GLuint = {0}
            glGenFramebuffers(framebuffers)
            _col_fbo = framebuffers[0]
            
            //renderbuffers : array of GLuint = {0}  //(not currently used)
            
            status : GLint
            vertex_shader : array of GLchar* = {Scene.collide_glslv.data}
            fragment_shader : array of GLchar* = {Scene.collide_glslf.data}

            // initialize vertex shader
            _col_vertex_shader = glCreateShader(GL_VERTEX_SHADER)
            glShaderSource(_col_vertex_shader, 1, vertex_shader, {-1})
            glCompileShader(_col_vertex_shader)

            // check compile status
            glGetShaderiv(_col_vertex_shader, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize fragment shader
            _col_fragment_shader = glCreateShader(GL_FRAGMENT_SHADER)
            glShaderSource(_col_fragment_shader, 1, fragment_shader, {-1})
            glCompileShader(_col_fragment_shader)

            // check compile status
            glGetShaderiv(_col_fragment_shader, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize program
            _col_program = glCreateProgram()
            glAttachShader(_col_program, _col_vertex_shader)
            glAttachShader(_col_program, _col_fragment_shader)
            glBindAttribLocation(_col_program, 0, "vertex")
            glLinkProgram(_col_program)

            // check link status
            glGetProgramiv(_col_program, GL_LINK_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // cleanup
            glDetachShader(_col_program, _col_vertex_shader)
            glDeleteShader(_col_vertex_shader)
            glDetachShader(_col_program, _col_fragment_shader)
            glDeleteShader(_col_fragment_shader)

            // create collision vbo
            _update_col()
        bodies_arr : array of soy.bodies.Body = bodies.values.to_array()
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_2D, _col_texture)
        var index = 0
        for body in bodies_arr
            if index >= 64
                break
            _col_texels[index] = body.position.x
            _col_texels[index+1] = body.position.y
            _col_texels[index+2] = body.position.z
            _col_texels[index+3] = body.col_radius
            index += 4
        var num_bodies = fmin(16,bodies_arr.length)
        // was glTexImage2D(GL_TEXTURE_2D, 0, (GLint) GL_RGBA32F_EXT,
        // which is not legal for GLES, changed the internal format to
        // GL_RGBA for testing -- TODO test this!
        glTexImage2D(GL_TEXTURE_2D, 0, (GLint) GL_RGBA,
                     4, 4, 0,
                     GL_RGBA, GL_FLOAT,
                     (GL.GLvoid*) self._col_texels)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER,
                        (GLint) GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER,
                        (GLint) GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
                        (GLint) GL_REPEAT)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
                        (GLint) GL_REPEAT)
        glActiveTexture(GL_TEXTURE1)
        glBindTexture(GL_TEXTURE_2D, _col_out_texture)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER,
                        (GLint) GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER,
                        (GLint) GL_NEAREST)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
                        (GLint) GL_REPEAT)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
                        (GLint) GL_REPEAT)
        glTexImage2D(GL_TEXTURE_2D, 0, (GLint) GL_RGB, 16, 16, 0,
                     GL_RGB, GL_UNSIGNED_BYTE, null)
        glBindFramebuffer(GL_FRAMEBUFFER, _col_fbo)
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                               GL_TEXTURE_2D, _col_out_texture, 0)
        status : GLenum = glCheckFramebufferStatus(GL_FRAMEBUFFER)
        assert status is GL_FRAMEBUFFER_COMPLETE
        glClearColor(0.0f,0.0f,0.0f,1.0f)
        glClear(GL_COLOR_BUFFER_BIT)
        glUseProgram(_col_program)
        glBindBuffer(GL_ARRAY_BUFFER, _col_vbo)
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE,
                              (GLsizei) 0, null)
        glEnableVertexAttribArray(0)
        tex_loc : GLint = glGetUniformLocation(_col_program, "bodies")
        glUniform1i(tex_loc, 0)
        glViewport(0,0,16,16)
        glDrawArrays(GL_POINTS, 0, (GLsizei) ((num_bodies-1)*num_bodies/2))
        glReadPixels(0, 0, (GLsizei) 16, (GLsizei) 16, GL_RGBA, GL_UNSIGNED_BYTE, (GLvoid*) _col_data)
        glViewport(x, y, width, height)
        glDisableVertexAttribArray(0)
        glBindFramebuffer(GL_FRAMEBUFFER, 0)

    /* Render Scene

        This is called by a Camera to render the scene.  The arguments come from
        the various camera/destination properties, these are used here instead
        of by the Camera class because some Scene subclasses may need to do
        more interesting things, like render in multiple passes with different
        znear/zfar parameters or bend the fov.
    */
    def virtual render (fov : GLfloat, aspect : GLfloat,
                        znear : GLfloat, zfar : GLfloat,
                        camera : soy.bodies.Camera, x: int, y : int,
                        width : int, height : int)
        mutex.lock()
        self.pre_render(camera)

        //
        // Projection Matrix
        // gluPerspective(fov, aspect, znear, zfar)
        projection : array of GLfloat = perspective(fov, aspect, znear, zfar)

        if projection[1] == -1.0f
            return

        //
        // View Matrix (inverse of camera)
        view : array of GLfloat[16] = new array of GLfloat[16]
        camera_model : array of GLfloat = camera.model_matrix()
        view[0]  = camera_model[0]
        view[1]  = camera_model[4]
        view[2]  = camera_model[8]
        view[3]  = 0.0f
        view[4]  = camera_model[1]
        view[5]  = camera_model[5]
        view[6]  = camera_model[9]
        view[7]  = 0.0f
        view[8]  = camera_model[2]
        view[9]  = camera_model[6]
        view[10] = camera_model[10]
        view[11] = 0.0f
        view[12] = -(camera_model[12] * camera_model[0] + camera_model[13] *
                     camera_model[1] + camera_model[14] * camera_model[2])
        view[13] = -(camera_model[12] * camera_model[4] + camera_model[13] *
                     camera_model[5] + camera_model[14] * camera_model[6])
        view[14] = -(camera_model[12] * camera_model[8] + camera_model[13] *
                     camera_model[9] + camera_model[14] * camera_model[10])
        view[15] = 1.0f

        //
        // Setup scene-level rendering
        glClear(GL_DEPTH_BUFFER_BIT)
        glEnable(GL_DEPTH_TEST)

        glDepthMask(GL_FALSE)

        self._enable_skybox(view, projection, zfar/2.0f)

        glDepthMask(GL_TRUE)

        lights_arr : array of soy.bodies.Light = lights.to_array()

        self.render_extra(view, projection, camera, lights_arr)

        //
        // Turn on fog if enabled
        /* FIXME GLSL1
        if _fog[3] != 0.0f
            // We'll Clear To The Color Of The Fog ( Modified )
            glClearColor(0.5f, 0.5f, 0.5f ,1.0f)    // FIXME
            glEnable(GL_FOG)                        // Enables GL_FOG
            // Note GL_FOG_MODE uses glFogi on desktop OpenGL, possible FIXME
            glFogf(GL_FOG_MODE, GL_EXP2)            // Fog Mode
            glFogfv(GL_FOG_COLOR, _fog)             // Set Fog Color
            glFogf(GL_FOG_DENSITY, self._fog[3]/20.0f) // FIXME wtf?
            glHint(GL_FOG_HINT, GL_NICEST)          // Fog Hint Value
            glFogf(GL_FOG_START, 1.0f)              // Fog Start Depth
            glFogf(GL_FOG_END, 50.0f)               // Fog End Depth
        */

        _stepLock.reader_lock()

        size : int = self.bodies.size
        if bodies.values is not null
            self.collide(x, y, width, height)
            bodies_arr : array of soy.bodies.Body = bodies.values.to_array()
            distances : array of float = new array of float[size]
            x_positions : array of float = new array of float[size]
            y_positions : array of float = new array of float[size]
            z_positions : array of float = new array of float[size]
            pos : soy.atoms.Position = camera.position
            j, k, l : int
            max : float
            j = 0
            l = 0

            for body in bodies_arr
                x_positions[j] = body.position.x
                y_positions[j] = body.position.y
                z_positions[j] = body.position.z

                j += 1

            body_distance_squared(x_positions, y_positions, z_positions,
                                  (float) pos.x, (float) pos.y, (float) pos.z)

            j = size
            while j > 0
                max = -1.0f
                for k = 0 to (size - 1)
                    if distances[k] > max
                        max = distances[k]
                        l = k
                distances[l] = -1.0f
                bodies_arr[l].render(false, view, projection, lights_arr,
                                     _ambient)
                bodies_arr[l].render(true, view, projection, lights_arr,
                                     _ambient)
                j -= 1
        
        for joint in joints
            joint.render(true, view, projection, lights_arr, _ambient)

        _stepLock.reader_unlock()
        
        self.post_render(view, projection, camera, lights_arr)

        mutex.unlock()
        
        // Disable fog if needed
        /* FIXME GLSL1
        if self._fog[3] != 0.0f
            glDisable(GL_FOG)

        */

    def virtual pre_render (camera : soy.bodies.Camera)
        return

    def virtual render_extra (view : array of GLfloat, projection : array of
                              GLfloat, camera : soy.bodies.Camera, lights :
                              array of soy.bodies.Light)
        return

    def virtual post_render (view : array of GLfloat, projection : array of
                             GLfloat, camera : soy.bodies.Camera, lights :
                             array of soy.bodies.Light)
        return


    /* Set projection matrix for perspective view

        This is a variant of  gluPerspective(fov, aspect, znear, zfar) which
        works with OpenGL ES, where GLU is designed for desktop OpenGL only.

        This is defined separately because subclasses may want to call it with
        a different render() method.
    */
    def static perspective (fovy : GLfloat, aspect : GLfloat,
                            zNear : GLfloat, zFar : GLfloat) : array of GLfloat
        // This function replaces gluPerspective for GLES
        m : array of GLfloat
        deltaZ : float = zFar - zNear
        radians : float = fovy / 2.0f * 3.141592653589793f / 180.0f
        sine : float = Posix.sinf(radians)

        // Bail now if parameters would divide by zero
        if ((deltaZ == 0.0f) || (sine == 0.0f) || (aspect == 0.0f))
            return {-1.0f, -1.0f}

        cotangent : float = Posix.cosf(radians) / sine

        // Set matrix
        m = {
            1.0f,   0.0f,   0.0f,   0.0f,
            0.0f,   1.0f,   0.0f,   0.0f,
            0.0f,   0.0f,   1.0f,  -1.0f,
            0.0f,   0.0f,   0.0f,   0.0f}
        m[0] = cotangent / aspect
        m[5] = cotangent
        m[10] = -(zFar + zNear) / deltaZ
        m[14] = -2.0f * zNear * zFar / deltaZ
        return m

    ////////////////////////////////////////////////////////////////////////
    // Pathfinding Methods

    def _check_collisions_NearCallback(o1 : ode.geoms.Geom, o2 : ode.geoms.Geom)
        result : bool*
        flags  : int = 1 //int.MIN + 1 //0x80000001 // 1000000000000000 0000000000000001

        cat1 : ulong = o1.GetCategoryBits()
        cat2 : ulong = o2.GetCategoryBits()
        if (cat1 & GeomIgnored) != 0 or (cat2 & GeomIgnored) != 0
            return
        else if o1.GetCategoryBits() == GeomTestRay
            result = ((bool*)o1.GetData())
        else if o2.GetCategoryBits() == GeomTestRay
            result = ((bool*)o2.GetData())
        else
            // Neither of the Geoms are the Rays we made, we can skip them.
            return
        if *result
            // we have already found that this ray has a collision
            return

        if (o2.IsSpace() | o1.IsSpace()) != 0
            o1.Collide2(o2, self._check_collisions_NearCallback)

        contactGeoms : ode.ContactGeomArray* = new ode.ContactGeomArray(1)
        num : int = o1.Collide(o2, flags, contactGeoms, (int)sizeof(ode.ContactGeom))
        if num != 0
            *result = true
        return


    def check_path_collision(start : soy.atoms.Position, end : soy.atoms.Position) : bool
        ends : array of soy.atoms.Position = {end}
        return check_collisions(start, ends)[0]

    /*
     * This should not be exposed in Python, this is just for use in the pathfinding code
     *
     * This takes in a start position and an array of other positions. It returns an array
     * of booleans where the ith entry is true if and only if there is not a path between the
     * start position and the ith entry of the given array.
     *
     */
    def check_collisions(start : soy.atoms.Position,
                         ends  : array of soy.atoms.Position) : array of bool
        ret : array of bool = new array of bool[ends.length]

        /* We do this whole thing with the pointers and the geoms array because we need
         * to make sure that there is a lock on the scene when all the new geoms get removed.
         * we also need to make sure that all geoms are removed before the next physics step.
         */
        geoms : array of ode.geoms.Ray* = new array of ode.geoms.Ray*[ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        // We don't want this running at the same time as a step.
        _stepLock.writer_lock()
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            dx : float = ends[i].x - start.x
            dy : float = ends[i].y - start.y
            dz : float = ends[i].z - start.z
            dist : ode.Real = (ode.Real) Math.hypotf(Math.hypotf(dx,dy),dz)
            ray  : ode.geoms.Ray* = new ode.geoms.Ray(self.space, dist)
            ray->Set((ode.Real) start.x, (ode.Real) start.y, (ode.Real) start.z,
                        (ode.Real) dx, (ode.Real) dy, (ode.Real) dz)
            ray->SetCollideBits(collide_bits)
            ray->SetCategoryBits(category_bits)
            ray->SetData((void *) (&(ret[i]))) /*set data to the pointer to the bool in ret*/
            geoms[i] = ray

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        for i : ode.geoms.Ray* in geoms
            //make sure all the geoms are removed
            delete i
        _stepLock.writer_unlock()
        return ret

    def check_collisions_with_radius(start  : soy.atoms.Position,
                                     ends   : array of soy.atoms.Position,
                                     radius : float) : array of bool
        ret : array of bool = new array of bool[ends.length]
        geoms : array of ode.geoms.Capsule* = new array of ode.geoms.Capsule*[ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        _stepLock.writer_lock()
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            end : soy.atoms.Position = ends[i]
            dist : float = Math.hypotf(Math.hypotf(end.x - start.x, end.y - start.y),
                                                   end.z - start.z)
            angle : float = Math.acosf((end.z - start.z)/(dist))

            // (0,0,dist) X ((end-start))
            //
            // | i j   k  |
            // | 0 0 dist |
            // | x y   z  |
            axis_x : float = -(dist*(end.y - start.y))
            axis_y : float = dist*(end.x - start.x)
            axis_z : float = 0

            cap : ode.geoms.Capsule* = new ode.geoms.Capsule(self.space, radius, dist)
            cap->SetPosition(start.x + (end.x - start.x)/2.0f, start.y + (end.y - start.y)/2.0f, start.z + (end.z - start.z)/2.0f)
            rot : ode.Matrix3 = new ode.Matrix3()
            rot.FromAxisAndAngle(axis_x, axis_y, axis_z, angle)
            cap->SetRotation(rot)
            cap->SetCollideBits(collide_bits)
            cap->SetCategoryBits(category_bits)
            cap->SetData((void *)(&(ret[i])))
            geoms[i] = cap

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        for i : ode.geoms.Capsule* in geoms
            //make sure all the rays are removed
            delete i
        _stepLock.writer_unlock()
        return ret



    /*
     * Version of check_collisions with the added atoms.Size argument, which is the size of the bounding box of
     * whatever you want to check collisions for. This function assumes that the object bounded will always be bounded by this box
     * no matter its (or the box's) orientation.
     *
     * NB This means that for a cube with side length of 1 which might spin around any of its axes the correct bounding box would be
     * (sqrt(3), sqrt(3), sqrt(3)), If it can only spin about its z-axis then the bounding box should be (sqrt(2), sqrt(2), 1), etc.
     */
    def check_collisions_with_size(start : soy.atoms.Position,
                                   ends  : array of soy.atoms.Position,
                                   aabb  : soy.atoms.Size) : array of bool
        ret : array of bool = new array of bool[ends.length]
        start_bool : bool = false
        geoms : array of ode.geoms.Box* = new array of ode.geoms.Box*[2*ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        x : float = (float) aabb.width
        y : float = (float) aabb.height
        z : float = (float) aabb.depth

        size_y : float = Math.hypotf(x,y)
        size_z : float = Math.hypotf(x,z)

        _stepLock.writer_lock()
        box_start : ode.geoms.Box* = new ode.geoms.Box(self.space, x, y, z)
        box_start->SetPosition(start.x, start.y, start.z)
        box_start->SetCollideBits(collide_bits)
        box_start->SetCategoryBits(category_bits)
        box_start->SetData((void *) (&start_bool))
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            end : soy.atoms.Position = ends[i]
            dist : float = Math.hypotf(Math.hypotf(end.x - start.x, end.y - start.y),
                                       end.z - start.z)

            // arccos(\frac{(dist,0,0) \cdot (end - start)}{dist^{2}})
            angle : float = Math.acosf((end.x - start.x)/(dist))

            // (dist,0,0) X (end-start)
            //
            // |   i  j k |
            // | dist 0 0 |
            // |   x  y z |
            axis_x : float = 0
            axis_y : float = -(dist*(end.z - start.z))
            axis_z : float = dist*(end.y - start.y)

            box_end   : ode.geoms.Box* = new ode.geoms.Box(self.space, x, y, z)
            middle    : ode.geoms.Box* = new ode.geoms.Box(self.space, dist, size_y, size_z)

            box_end->SetPosition(end.x, end.y, end.z)
            middle->SetPosition(start.x + (end.x - start.x)/2.0f, start.y + (end.y - start.y)/2.0f, start.z + (end.z - start.z)/2.0f)

            rot : ode.Matrix3 = new ode.Matrix3()
            rot.FromAxisAndAngle(axis_x, axis_y, axis_z, angle)
            middle->SetRotation(rot)

            box_end->SetCollideBits(collide_bits)
            middle->SetCollideBits(collide_bits)

            box_end->SetCategoryBits(category_bits)
            middle->SetCategoryBits(category_bits)

            // set data to the pointer to the same bool in ret, so if any of them goes they all do
            box_end->SetData((void *) (&(ret[i])))
            middle->SetData((void *) (&(ret[i])))

            geoms[2*i] = middle
            geoms[2*i+1] = box_end

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        delete box_start
        for i : ode.geoms.Box* in geoms
            //make sure all the rays are removed
            delete i
        _stepLock.writer_unlock()
        if start_bool
            //Means there was a collision at the very begining, so set all paths to true
            for i : int = 0 to (ends.length - 1)
                ret[i] = true
        return ret

    
    def _enable_skybox(view : array of GLfloat, projection : array of GLfloat,
                       zScale : float)
        if _skybox is null
            return

        if _skybox_program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Scene.skybox_glslv.data}
            fragment_shader : array of GLchar* = {Scene.skybox_glslf.data}

            // initialize vertex shader
            _vertex_shader = glCreateShader(GL_VERTEX_SHADER)
            glShaderSource(_vertex_shader, 1, vertex_shader, {-1})
            glCompileShader(_vertex_shader)

            // check compile status
            glGetShaderiv(_vertex_shader, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize fragment shader
            _fragment_shader = glCreateShader(GL_FRAGMENT_SHADER)
            glShaderSource(_fragment_shader, 1, fragment_shader, {-1})
            glCompileShader(_fragment_shader)

            // check compile status
            glGetShaderiv(_fragment_shader, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize program
            _skybox_program = glCreateProgram()
            glAttachShader(_skybox_program, _vertex_shader)
            glAttachShader(_skybox_program, _fragment_shader)
            glBindAttribLocation(_skybox_program, 0, "vertex")
            glLinkProgram(_skybox_program)

            // check link status
            glGetProgramiv(_skybox_program, GL_LINK_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // cleanup
            glDetachShader(_skybox_program, _vertex_shader)
            glDeleteShader(_vertex_shader)
            glDetachShader(_skybox_program, _fragment_shader)
            glDeleteShader(_fragment_shader)

        // bring view matrix to origin while keeping rotation
        skybox_view : array of GLfloat = new array of GLfloat[16]
        skybox_view[0] = view[0]
        skybox_view[1] = view[1]
        skybox_view[2] = view[2]
        skybox_view[3] = view[3]
        skybox_view[4] = view[4]
        skybox_view[5] = view[5]
        skybox_view[6] = view[6]
        skybox_view[7] = view[7]
        skybox_view[8] = view[8]
        skybox_view[9] = view[9]
        skybox_view[10] = view[10]
        skybox_view[11] = view[11]
        skybox_view[12] = 0.0f
        skybox_view[13] = 0.0f
        skybox_view[14] = 0.0f
        skybox_view[15] = view[15]

        // scaling matrix
        scale : array of GLfloat = {
            zScale, 0.0f,   0.0f,   0.0f,
            0.0f,   zScale, 0.0f,   0.0f,
            0.0f,   0.0f,   zScale, 0.0f,
            0.0f,   0.0f,   0.0f,   1.0f}

        // update (if necessary) the skybox or rebind buffers
        if _skybox_updated
            _update_skybox()

        // rebind buffers when they arent getting updated
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glUseProgram(_skybox_program)
        mv_loc : GLint = glGetUniformLocation(_skybox_program, "V")
        glUniformMatrix4fv(mv_loc, 1, GL_FALSE, skybox_view)
        p_loc : GLint = glGetUniformLocation(_skybox_program, "P")
        glUniformMatrix4fv(p_loc, 1, GL_FALSE, projection)
        s_loc : GLint = glGetUniformLocation(_skybox_program, "S")
        glUniformMatrix4fv(s_loc, 1, GL_FALSE, scale)
        glActiveTexture(GL_TEXTURE0)

        _skybox.enable()

        c_loc : GLint = glGetUniformLocation(_skybox_program, "cube")
        glUniform1i(c_loc, 0)

        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, (GLsizei) 0, null)

        glEnableVertexAttribArray(0)

        glDrawElements(GL_TRIANGLES, (GLsizei) 36, GL_UNSIGNED_BYTE, (GLvoid*) 0)

        glDisableVertexAttribArray(0)

        _skybox.disable()

    def _update_col()
        ///////////////////////////////////////////////
        // 15x15 triangle grid of points (16 bodies)
        // each point represents a collision check
        //
        // example (4 bodies):
        //
        //           body 1
        //          1 2 3 4
        //        4 . . .
        // body 2 3 . .
        //        2 .
        //        1

        // on first pass
        if _col_vbo == 0
            buffers : array of GLuint = {0}
            glGenBuffers(buffers)
            _col_vbo = buffers[0]

        vertices : array of GLfloat = new array of GLfloat[240]
        var index = 0
        for var i = 1 to 15
            for var j = 0 to (i-1)
                vertices[index*2] = (j+0.5f)/16
                vertices[index*2+1] = (i+0.5f)/16
                index++

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _col_vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (240 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

    def _update_skybox()
        ///////////////////////////////////////////////
        // The skybox is rendered before anything else is and before the depth
        // buffer is turned on. Therefore, the width, height, and depth of it
        // are 1 to simplify code. It is a cube that the scene is rendered on
        // top of to provide a background. 
        //
        //    2.......3
        //   /|      /|
        //  6.......7 |
        //  | |     | |
        //  | 0.....|.1
        //  |/      |/
        //  4.......5

        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0, 0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        // each side is composed of 4 vertices and 2 triangles
        // there are 8 total vertices in the skybox
        // each dot in the diagram below is a vertex
        // .---.
        // | / |
        // .___.

        // the faces are generated in this order:
        // right, left, top, bottom, front, back

        // index array of vertex array
        elements : array of GLubyte = {
            2, 0, 1,    1, 3, 2, 
            4, 0, 2,    2, 6, 4,
            1, 5, 7,    7, 3, 1,
            4, 6, 7,    7, 5, 4,
            2, 3, 7,    7, 6, 2,
            0, 4, 1,    1, 4, 5
        }
        
        // because it is only a texture being rendered, openGl only needs
        // positions (px py pz)
        vertices : array of GLfloat = {
            -1,-1,-1,
             1,-1,-1,
            -1, 1,-1,
             1, 1,-1,
            -1,-1, 1,
             1,-1, 1,
            -1, 1, 1,
             1, 1, 1
        }

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (36 * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (8 * 3 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)
        _skybox_updated = false

    def body_distance(xs : array of float, ys : array of float, zs : array of float,
                      xOrig : float, yOrig : float, zOrig : float) : array of float
        distances : array of float = new array of float[self.bodies.size]

        dx, dy, dz : float

        for var i = 0 to (self.bodies.size-1)
            dx = xs[i] - xOrig
            dy = ys[i] - yOrig
            dz = zs[i] - zOrig

            distances[i] = sqrtf(dx*dx + dy*dy + dz*dz)

        return distances

    def body_distance_squared(xs : array of float, ys : array of float, zs : array of float,
                               xOrig : float, yOrig : float, zOrig : float) : array of float
        distanceSquared : array of float = new array of float[self.bodies.size]

        dx, dy, dz : float

        for var i = 0 to (self.bodies.size-1)
            dx = xs[i] - xOrig
            dy = ys[i] - yOrig
            dz = zs[i] - zOrig

            distanceSquared[i] = dx*dx + dy*dy + dz*dz

        return distanceSquared

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // time Property
    _time : uint64
    prop time : uint64
        get
            return self._time

    //
    // ambient Property
    _ambient : array of GLfloat
    _ambient_obj : weak soy.atoms.Color?

    def _ambient_set(color : soy.atoms.Color)
        _ambient = color.get4f()

    def _ambient_weak(ambient : Object)
        self._ambient_obj = null

    prop ambient : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._ambient_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._ambient)
                value.on_set.connect(self._ambient_set)
                value.weak_ref(self._ambient_weak)
                self._ambient_obj = value
            return value
        set
            self._ambient_set(value)
            if _ambient_obj != null
                _ambient_obj.on_set.disconnect(self._ambient_set)
                _ambient_obj.weak_unref(self._ambient_weak)
            _ambient_obj = value
            value.on_set.connect(self._ambient_set)
            value.weak_ref(self._ambient_weak)


    //
    // fog Property
    _fog : array of GLfloat
    _fog_obj : weak soy.atoms.Color?

    def _fog_set(color : soy.atoms.Color)
        _fog = color.get4f()

    def _fog_weak(ambient : Object)
        self._fog_obj = null

    prop fog : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._fog_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._fog)
                value.on_set.connect(self._fog_set)
                value.weak_ref(self._fog_weak)
                self._fog_obj = value
            return value
        set
            self._fog_set(value)
            if _fog_obj != null
                _fog_obj.on_set.disconnect(self._fog_set)
                _fog_obj.weak_unref(self._fog_weak)
            _fog_obj = value
            value.on_set.connect(self._fog_set)
            value.weak_ref(self._fog_weak)


    //
    // gravity Property
    _gravity : soy.atoms.Vector
    prop gravity : soy.atoms.Vector
        get
            return _gravity
        set
            _stepLock.writer_lock()
            _gravity = value
            _stepLock.writer_unlock()


    prop length : ulong
        get
            res : ulong = 0
            mutex.lock()
            res = bodies.size
            mutex.unlock()
            return res

    prop skybox : soy.textures.Cubemap
        get
            return _skybox
        set
            _skybox = value
            _skybox_updated = true
            

    //
    // stepsize Property
    prop stepsize : float

    //
    // rotation Property
    _rotation : array of GLfloat
    prop rotation : array of GLfloat
        get
            return _rotation
        set
            _stepLock.writer_lock()
            _rotation = value
            _stepLock.writer_unlock()

    //
    // position Property
    _position : soy.atoms.Position
    prop position : soy.atoms.Position
        get
            return _position
        set
            _stepLock.writer_lock()
            _position = value
            _stepLock.writer_unlock()

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _skybox_program : static GLuint

    _col_vertex_shader : static GLuint
    _col_fragment_shader : static GLuint
    _col_program : static GLuint
