/*
 *  libsoy - soy.bodies.Body
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
    Gee
    GL
    ode
    soy.atoms
    GLib.Math

class soy.bodies.Body : Object
    _axis_ebo : GLuint
    _axis_updated : bool
    _axis_vbo : GLuint // for axis render
    body : ode.Body
    _density : float
    fogcoords : array of GLfloat
    geom : ode.geoms.Geom
    key : string
    mutex : Mutex
    tslvs : array of GLfloat

    init static
        if soy.scenes._thread is null
            soy.scenes._thread = new soy.scenes._PhysicsThread ()

    init
        // This is to ensure the VBOs and materials do not change while a Body
        // is being rendered, but allow reading values while being rendered.
        mutex = Mutex()

        // This is intended for use with fields, though currently not used.
        tags_ = new dict of string,float?

        _density = 1.0f

        _axis = false
        _axis_x = _axis_y = _axis_z = 1.0f

        _axis_updated = true

        // Create new ode.Body
        body = new ode.Body(soy.scenes._world)

    construct (position : soy.atoms.Position?, geom_param : Object?,
               geom_scalar : float)
        self.create_geom(geom_param, geom_scalar)
        if position is not null
            self.position = position


    def virtual create_geom (geom_param : Object?, geom_scalar : float)
        geom = new ode.geoms.Sphere(null, (Real) 1.0)
        geom.Disable() // Because "Ghost" mode doesn't seem to be working
        geom.SetCategoryBits(GeomGhost)
        geom.SetData((void*) self)

        body.SetData((void*) self)

        // Copy position and orientation from geom
        pos : weak ode.Vector3 = geom.GetPosition()
        body.SetPosition(pos.x, pos.y, pos.z)
        body.SetRotation(geom.GetRotation())
        
        self.geom.SetBody(self.body)

        // Set mass of the body
        self.set_mass (_density)

    def virtual set_mass (density : float)
        return


    final
        if self.scene is not null and self.scene.bodies.has(self.key, self)
            self.remove()

    //
    // public methods

    //
    // Add forces to bodies (absolute or relative coordinates).
    //
    // The ...RelForce and ...RelTorque functions take force vectors that are
    // relative to the body's own frame of reference.
    // The ...ForceAtPos and ...ForceAtRelPos functions take an extra position
    // vector (in global or body-relative coordinates respectively) that
    // specifies the point at which the force is applied.
    // All other functions apply the force at the center of mass.
    def addForce(fx : ode.Real, fy : ode.Real, fz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddForce(fx, fy, fz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addTorque(fx : ode.Real, fy : ode.Real, fz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddTorque(fx, fy, fz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addRelForce(fx : ode.Real, fy : ode.Real, fz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddRelForce(fx, fy, fz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addRelTorque(fx : ode.Real, fy : ode.Real, fz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddRelTorque(fx, fy, fz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addForceAtPos(fx : ode.Real, fy : ode.Real, fz : ode.Real, 
                      px : ode.Real, py : ode.Real, pz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddForceAtPos(fx, fy, fz, px, py, pz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addForceAtRelPos(fx : ode.Real, fy : ode.Real, fz : ode.Real, 
                         px : ode.Real, py : ode.Real, pz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddForceAtRelPos(fx, fy, fz, px, py, pz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addRelForceAtPos(fx : ode.Real, fy : ode.Real, fz : ode.Real, 
                         px : ode.Real, py : ode.Real, pz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddRelForceAtPos(fx, fy, fz, px, py, pz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def addRelForceRelAtPos(fx : ode.Real, fy : ode.Real, fz : ode.Real, 
                            px : ode.Real, py : ode.Real, pz : ode.Real)
        if scene is not null
            soy.scenes._stepLock.writer_lock()
        body.AddRelForceAtRelPos(fx, fy, fz, px, py, pz)
        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    // Toggle body as immovable.
    def toggle_immovable()
        if scene is not null
            soy.scenes._stepLock.writer_lock()

        if self.geom.GetBody() is not null
            self.geom.SetBody(null)
        else
            self.geom.SetBody(self.body)

        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    // TODO we need a "protected" mode so this can be used by Light directly
    // Please do not expose this in PySoy
    def getPositionf() : array of float
        if scene is null
            return {0.0f, 0.0f, 0.0f, 1.0f}
        v : unowned ode.Vector3 = self.body.GetPosition()
        return {(float) v.x, (float) v.y, (float) v.z, 1.0f}


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // scene Property
    scene : soy.scenes.Scene? = null

    //
    // tags property
    tags_ : dict of string,float? // NOTE: this is protected
    prop tags : dict of string,float?
        owned get
            if scene is null
                return new dict of string,float?
            return self.tags_

    //
    // density property
    prop density : float
        get
            return self._density
        set
            if value >= 0
                self._density = value
                if scene is not null
                    soy.scenes._stepLock.writer_lock()
                self.set_mass (value)
                if scene is not null
                    soy.scenes._stepLock.writer_unlock()


    //
    // position Property
    _position_obj : weak soy.atoms.Position?

    def _position_set(value : soy.atoms.Position)
        // When not in a scene, set the geom's position
        if scene is null
            geom.SetPosition((ode.Real) value.x,
                             (ode.Real) value.y,
                             (ode.Real) value.z)

        // Set the body's position
        else
            soy.scenes._stepLock.writer_lock()
            body.SetPosition((ode.Real) value.x,
                             (ode.Real) value.y,
                             (ode.Real) value.z)
            soy.scenes._stepLock.writer_unlock()

    def _position_weak(position : Object)
        self._position_obj = null

    prop position : soy.atoms.Position
        owned get
            v : unowned ode.Vector3
            value : soy.atoms.Position? = self._position_obj

            // When not in a scene, get the geom's position
            if scene is null
                v = geom.GetPosition()

            // Set the body's position
            else
                v = body.GetPosition()

            if value is null or (float)v.x != value.x or (float)v.y != value.y or (float)v.z != value.z
                if not(value is null)
                    _position_obj.on_set.disconnect(self._position_set)
                    _position_obj.weak_unref(self._position_weak)
                value = new soy.atoms.Position((float) v.x,
                                               (float) v.y,
                                               (float) v.z)
                value.on_set.connect(self._position_set)
                value.weak_ref(self._position_weak)
                self._position_obj = value
            return value
        set
            self._position_set(value)
            if _position_obj != null
                _position_obj.on_set.disconnect(self._position_set)
                _position_obj.weak_unref(self._position_weak)
            _position_obj = value
            value.on_set.connect(self._position_set)
            value.weak_ref(self._position_weak)
        // TODO we need to somehow update the _position_obj whenever the body
        // its attached to moves.  This would make the most sense in Scene.

    //
    // rotation Property
    _rotation_obj : weak soy.atoms.Rotation?

    def _rotation_set(rot : soy.atoms.Rotation)
        q : ode.Quaternion = new ode.Quaternion()
        q.w = rot.w
        q.x = rot.x
        q.y = rot.y
        q.z = rot.z
        // ode likes them to be zxy angles.
        soy.scenes._stepLock.writer_lock()
        self.body.SetQuaternion(q)
        soy.scenes._stepLock.writer_unlock()
        return

    def _rotation_weak(rotation : Object)
        self._rotation_obj = null

    prop rotation : soy.atoms.Rotation
        owned get
            if scene is null
                return new soy.atoms.Rotation()

            soy.scenes._stepLock.reader_lock()
            q : unowned ode.Quaternion = self.body.GetQuaternion()
            soy.scenes._stepLock.reader_unlock()
            value : soy.atoms.Rotation? = self._rotation_obj
            
            if value is null or (float)q.x != value.x or (float)q.y != value.y or (float)q.z != value.z or (float)q.w != value.w
                if not(value is null)
                    _rotation_obj.on_set.disconnect(self._rotation_set)
                    _rotation_obj.weak_unref(self._rotation_weak)
                value = new soy.atoms.Rotation((float)q.w, (float)q.x, (float)q.y, (float)q.z)
                value.on_set.connect(self._rotation_set)
                value.weak_ref(self._rotation_weak)
                self._rotation_obj = value
            return value
        set
            self._rotation_set(value)
            if self._rotation_obj!= null
                self._rotation_obj.on_set.disconnect(self._rotation_set)
                self._rotation_obj.weak_unref(self._rotation_weak)
            self._rotation_obj = value
            value.on_set.connect(self._rotation_set)
            value.weak_ref(self._rotation_weak)

    //
    // scale Property
    _scale : float = 1.0f
            
    prop scale : float
        get
            return _scale
        set
            _scale = value

    // Body's linear velocity
    //
    // This is how fast and in which direction a body is moving in a scene.
    // Defaults to (0,0,0)
    prop velocity : soy.atoms.Vector
        owned get
            if scene is null
                return new soy.atoms.Vector()
            var value = new soy.atoms.Vector()
            soy.scenes._stepLock.reader_lock()
            vel : weak ode.Vector3 = self.body.GetLinearVel()
            value.x = (float) vel.x
            value.y = (float) vel.y
            value.z = (float) vel.z
            soy.scenes._stepLock.reader_unlock()
            return value
        set
            soy.scenes._stepLock.writer_lock()
            self.body.SetLinearVel(value.x, value.y, value.z)
            soy.scenes._stepLock.writer_unlock()

    //
    // Collision Radius Property
    _col_radius : GLfloat
    prop virtual readonly col_radius : float
        get
            return self._col_radius

    //
    // axis property
    _axis : bool
    prop axis : bool
        get
            return self._axis
        set
            mutex.lock()
            self._axis = value
            mutex.unlock()

    //
    // axis size Property
    _axis_x : GLfloat
    _axis_y : GLfloat
    _axis_z : GLfloat
    _axis_size_obj : weak soy.atoms.Size?

    def _axis_size_set(size : soy.atoms.Size)
        // Set size while locked to avoid potential rendering weirdness
        mutex.lock()
        _axis_x = (GLfloat) size.width
        _axis_y = (GLfloat) size.height
        _axis_z = (GLfloat) size.depth
        _axis_updated = true
        mutex.unlock()

    def _axis_size_weak(size : Object)
        _axis_size_obj = null

    prop axis_size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._axis_size_obj
            if value is null
                value = new soy.atoms.Size((float) _axis_x,
                                           (float) _axis_y,
                                           (float) _axis_z)
                value.on_set.connect(self._axis_size_set)
                value.weak_ref(self._axis_size_weak)
                self._axis_size_obj = value
            return value
        set
            self._axis_size_set(value)
            _axis_size_obj = value
            value.on_set.connect(self._axis_size_set)
            value.weak_ref(self._axis_size_weak)

    def add (k : string, v : soy.scenes.Scene)
        // First detach body from old scene (if any)
        if scene is not null
            self.remove()

        // Store key and value
        key = k
        scene = v

        // Attach geom to scene
        scene.space.Add(geom)

        // Perform any extra class-specific steps
        self.add_extra()


    def remove ()
        scene.bodies.unset(key)
        scene.space.Remove(geom)
        scene = null

        // Perform any extra class-specific steps
        self.remove_extra()


    def virtual add_extra ()
        return


    def virtual remove_extra ()
        return

    def virtual pointDepth (x : float, y : float, z : float) : float
        return 0.0f


    def virtual volume ( ) : float
        return 0.0f


    //def virtual radius ( ) : float
    //    return 0.0f


    def virtual finite ( ) : int
        return 0


    // Returns body's model matrix.
    def virtual model_matrix ( ) : array of GLfloat
        var _mtx = new array of GLfloat[16]
        rotation : unowned ode.Matrix3 = self.body.GetRotation()
        position : unowned ode.Vector3 = self.body.GetPosition()

        _mtx[0]  = (GLfloat) rotation.m0 * _scale
        _mtx[1]  = (GLfloat) rotation.m4
        _mtx[2]  = (GLfloat) rotation.m8
        _mtx[3]  = (GLfloat) 0.0
        _mtx[4]  = (GLfloat) rotation.m1
        _mtx[5]  = (GLfloat) rotation.m5 * _scale
        _mtx[6]  = (GLfloat) rotation.m9
        _mtx[7]  = (GLfloat) 0.0
        _mtx[8]  = (GLfloat) rotation.m2
        _mtx[9]  = (GLfloat) rotation.m6
        _mtx[10] = (GLfloat) rotation.ma * _scale
        _mtx[11] = (GLfloat) 0.0
        _mtx[12] = (GLfloat) position.x
        _mtx[13] = (GLfloat) position.y
        _mtx[14] = (GLfloat) position.z
        _mtx[15] = (GLfloat) 1.0
        return _mtx


    def virtual render ( alpha_stage : bool, view : array of GLfloat,
                         projection : array of GLfloat, lights : array of
                         soy.bodies.Light, ambient : array of GLfloat )
        return


    def calcFogCoords (vertices : array of GLfloat, _depth : float)
        if vertices.length is not 0
            self.fogcoords = new array of GLfloat[(int)(vertices.length/15)]
            for var i=0 to (vertices.length/15)
                self.fogcoords[i] = _depth + vertices[i*11+2]

    def packArrays (position : array of GLfloat, normal : array of GLfloat,
                    texcoord : array of GLfloat, tangent : array of GLfloat
                    ) : array of GLfloat
        // get number of vertices
        var number = position.length/3
        var vertices = new array of GLfloat[number*11]
        for var i=0 to (number-1)
            vertices[i*11] = position[i*3]
            vertices[i*11+1] = position[i*3+1]
            vertices[i*11+2] = position[i*3+2]
            vertices[i*11+3] = normal[i*3]
            vertices[i*11+4] = normal[i*3+1]
            vertices[i*11+5] = normal[i*3+2]
            vertices[i*11+6] = texcoord[i*2]
            vertices[i*11+7] = texcoord[i*2+1]
            vertices[i*11+8] = tangent[i*3]
            vertices[i*11+9] = tangent[i*3+1]
            vertices[i*11+10] = tangent[i*3+2]
        return vertices

    def getRelPointPos (bodyB : soy.bodies.Body) : soy.atoms.Vector
        posA : unowned ode.Vector3 = self.body.GetPosition()
        posB : unowned ode.Vector3 = bodyB.body.GetPosition()
        return new soy.atoms.Vector((float)(posB.x-posA.x),
                   (float)(posB.y-posA.y), (float)(posB.z-posA.z))

    def renderAxis ( )
        if not _axis
            return

        // Update ebo/vbo as needed
        if _axis_updated
            _update_axis()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _axis_ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _axis_vbo)

        // Disable unused pointers
        // FIXME GLSL1 glDisableClientState(GL_NORMAL_ARRAY)
        // FIXME GLSL1 glDisableClientState(GL_TEXTURE_COORD_ARRAY)

        // FIXME GLSL1 glEnableClientState(GL_COLOR_ARRAY)

        glDisable(GL_CULL_FACE)
        glDisable(GL_DEPTH_TEST)
        /* FIXME GLSL1 
        glDisable(GL_LIGHTING)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 7), null)
        glColorPointer(4, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 7),
                        (GLvoid*) (sizeof(GLfloat) * 3))
        */

        // Render
        glDrawElements(GL_LINES, 24, GL_UNSIGNED_BYTE, (GLvoid*) 0)

        // FIXME GLSL1 glEnable(GL_LIGHTING)
        glEnable(GL_DEPTH_TEST)
        glEnable(GL_CULL_FACE)

        // FIXME GLSL1 glDisableClientState(GL_COLOR_ARRAY)

        // Re-enable pointers
        /* FIXME GLSL1
        glEnableClientState(GL_NORMAL_ARRAY)
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        */

    def _update_axis ( )
        // on first pass
        if _axis_ebo == 0
            glGenBuffers({_axis_ebo, _axis_vbo})

        elements : array of GLubyte = {
            0, 1,   2, 4,   2, 3,   3, 4,
            5, 6,   7, 9,   8, 9,   8, 7,
            10,11,  14,12,  13,12,  13,14
        }

        // px py pz cx cy cz
        vertices : array of GLfloat = {
            // X Axis
            0.0f,         0.0f,         0.0f,         1.0f,0.0f,0.0f,1.0f,
            _axis_x,      0.0f,         0.0f,         1.0f,0.0f,0.0f,1.0f,
            _axis_x,      0.3f,         0.0f,         1.0f,0.0f,0.0f,1.0f,
            _axis_x+0.3f, 0.0f,         0.0f,         1.0f,0.0f,0.0f,1.0f,
            _axis_x,     -0.3f,         0.0f,         1.0f,0.0f,0.0f,1.0f,
            // Y Axis
            0.0f,         0.0f,         0.0f,         0.0f,1.0f,0.0f,1.0f,
            0.0f,         _axis_y,      0.0f,         0.0f,1.0f,0.0f,1.0f,
            0.3f,         _axis_y,      0.0f,         0.0f,1.0f,0.0f,1.0f,
            0.0f,         _axis_y+0.3f, 0.0f,         0.0f,1.0f,0.0f,1.0f,
           -0.3f,         _axis_y,      0.0f,         0.0f,1.0f,0.0f,1.0f,
            // Z Axis
            0.0f,         0.0f,         0.0f,         0.0f,0.0f,1.0f,1.0f,
            0.0f,         0.0f,         _axis_z,      0.0f,0.0f,1.0f,1.0f,
            0.3f,         0.0f,         _axis_z,      0.0f,0.0f,1.0f,1.0f,
            0.0f,         0.0f,         _axis_z+0.3f, 0.0f,0.0f,1.0f,1.0f,
           -0.3f,         0.0f,         _axis_z,      0.0f,0.0f,1.0f,1.0f
        }

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _axis_ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (
                     12 * 2 * sizeof(GLubyte)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _axis_vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (15 * 7 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _axis_updated = false

    def calculateEdges (vertices : array of GLfloat, indices : array of GLushort) : array of GLushort
        var count = indices.length*2
        var edgearray = new array of GLushort [count]
        var index = 0
        var i = 0
        while i is not indices.length
            var v1 = indices[i++]
            var v2 = indices[i++]
            var v3 = indices[i++]
            l:array of GLushort = {v1, v2}
            l2:array of GLushort = {v2, v3}
            l3:array of GLushort = {v1, v3}
            edgearray[index++] = l[0]
            edgearray[index++] = l[1]
            edgearray[index++] = l2[0]
            edgearray[index++] = l2[1]
            edgearray[index++] = l3[0]
            edgearray[index++] = l3[1]
        return edgearray


    def calculate_model_view(model : array of GLfloat, view : array of GLfloat) : array of GLfloat
        model_view : array of GLfloat[16] = new array of GLfloat[16]

        for var r=0 to 3
            for var c=0 to 3
                model_view[4*r+c] = 0.0f
                for var j=0 to 3
                    model_view[4*r+c] += (view[4*j+c] * model[4*r+j])

        return model_view

