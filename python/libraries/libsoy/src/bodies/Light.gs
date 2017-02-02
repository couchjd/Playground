/*
 *  libsoy - soy.bodies.Light
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
    GL
    GLib.Math
    ode

class soy.bodies.Light : soy.bodies.Body
    light_glslv : static extern string
    light_glslf : static extern string

    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    VERTICES : GLuint = 40 // not including center
    //TODO calculate number of vertices needed (>256)

    init
        _diffuse = {1.0f, 1.0f, 1.0f, 1.0f}
        _specular = {1.0f, 1.0f, 1.0f, 1.0f}
        _radius = 180.0f

    construct (position : soy.atoms.Position?, size : float, 
               texture : soy.textures.Texture?)
        super(position, null, 0.0f)
        _updated = true
        _texture = texture
        _size = size

    final
        if self.scene is not null and self.scene.lights.contains(self)
            soy.scenes._stepLock.writer_lock()
            self.scene.lights.remove(self)
            soy.scenes._stepLock.writer_unlock()

    def override add_extra ()
        scene.lights.add(self)

    def override remove_extra ()
        scene.lights.remove(self)

    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        if _size is 0 or _texture is null
            return
        if _program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Light.light_glslv.data}
            fragment_shader : array of GLchar* = {Light.light_glslf.data}
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
            _program = glCreateProgram()
            glAttachShader(_program, _vertex_shader)
            glAttachShader(_program, _fragment_shader)
            glBindAttribLocation(_program, 0, "vertex")
            glBindAttribLocation(_program, 2, "texcoord")
            glLinkProgram(_program)

            // check link status
            glGetProgramiv(_program, GL_LINK_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // cleanup
            glDetachShader(_program, _vertex_shader)
            glDeleteShader(_vertex_shader)
            glDetachShader(_program, _fragment_shader)
            glDeleteShader(_fragment_shader)
        // Lock so body cant be changed during render
        mutex.lock()

        // get model matrix
        model : array of GLfloat = self.model_matrix()

        // modelview matrix (face camera)
        model_view : array of GLfloat[16] = new array of GLfloat[16]
        model_view[0]  = 1.0f
        model_view[1]  = 0.0f
        model_view[2]  = 0.0f
        model_view[3]  = 0.0f
        model_view[4]  = 0.0f
        model_view[5]  = 1.0f
        model_view[6]  = 0.0f
        model_view[7]  = 0.0f
        model_view[8]  = 0.0f
        model_view[9]  = 0.0f
        model_view[10] = 1.0f
        model_view[11] = 0.0f
        model_view[12] = (model[12]*view[0] + model[13]*view[4] +
                          model[14]*view[8] + view[12])
        model_view[13] = (model[12]*view[1] + model[13]*view[5] +
                          model[14]*view[9] + view[13])
        model_view[14] = (model[12]*view[2] + model[13]*view[6] +
                          model[14]*view[10] + view[14])
        model_view[15] = 1.0f

        // Update ebo/vbo as needed
        if _updated
            _update_light()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glUseProgram(_program)
        mv_loc : GLint = glGetUniformLocation(_program, "mv_matrix")
        glUniformMatrix4fv(mv_loc, 1, GL_FALSE, model_view)
        p_loc : GLint = glGetUniformLocation(_program, "p_matrix")
        glUniformMatrix4fv(p_loc, 1, GL_FALSE, projection)
        glActiveTexture(GL_TEXTURE0)
        tex_loc : GLint = glGetUniformLocation(_program, "tex")
        glUniform1i(tex_loc, 0)

        _texture.enable()

        //offset : int = 0  //(currently not used)

        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), null)
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), (GLvoid*)
                              (sizeof(GLfloat) * 6))

        glEnableVertexAttribArray(0)
        glEnableVertexAttribArray(2)

        glDrawElements(GL_TRIANGLE_FAN, (GLsizei) (VERTICES+2),
                       GL_UNSIGNED_BYTE, (GLvoid*) 0)

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(2)

        _texture.disable()

        // Render axis
        //renderAxis()

        // Rendering done, unlock
        mutex.unlock()

    def override set_mass (density : float)
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetSphere(density, _size)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

    def _update_light()
        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        // index array of vertex array
        elements : array of GLubyte = new array of GLubyte[VERTICES+2]

        for var i=0 to (VERTICES+1)
            elements[i] = i
        elements[VERTICES+1] = 1

        // interleaved (vertex, normal, texcoord) array
        vertices : array of GLfloat = new array of GLfloat[(1+VERTICES)*11] // count center

        for var i=1 to VERTICES
            var angle = 2.0f * PI * (i-1) / VERTICES
            var x = (GLfloat)cos(angle)
            var y = (GLfloat)sin(angle)
            vertices[i*11] = _size * x
            vertices[i*11+1] = _size * y
            vertices[i*11+2] = 0
            vertices[i*11+3] = 0
            vertices[i*11+4] = 0
            vertices[i*11+5] = 1
            vertices[i*11+6] = 0.5f * x + 0.5f
            vertices[i*11+7] = -0.5f * y + 0.5f
            vertices[i*11+8] = 1
            vertices[i*11+9] = 0
            vertices[i*11+10] = 0

        // add the center vertex
        vertices[0] = 0
        vertices[1] = 0
        vertices[2] = 0
        vertices[3] = 0
        vertices[4] = 0
        vertices[5] = 1
        vertices[6] = 0.5f
        vertices[7] = 0.5f
        vertices[8] = 1
        vertices[9] = 0
        vertices[10] = 0

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, 
                     (GLsizei) ((VERTICES+2) * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, 
                     (GLsizei) (11 * (VERTICES+1) * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // diffuse Property
    _diffuse : array of GLfloat
    _diffuse_obj : weak soy.atoms.Color?

    def _diffuse_set(diffuse : soy.atoms.Color)
        _diffuse = diffuse.get4f()

    def _diffuse_weak(diffuse : Object)
        self._diffuse_obj = null

    prop diffuse : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._diffuse_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._diffuse)
                value.on_set.connect(self._diffuse_set)
                value.weak_ref(self._diffuse_weak)
                self._diffuse_obj = value
            return value
        set
            self._diffuse_set(value)
            if _diffuse_obj != null
                _diffuse_obj.on_set.disconnect(self._diffuse_set)
                _diffuse_obj.weak_unref(self._diffuse_weak)
            _diffuse_obj = value
            value.on_set.connect(self._diffuse_set)
            value.weak_ref(self._diffuse_weak)

    //
    // specular Property
    _specular : array of GLfloat
    _specular_obj : weak soy.atoms.Color?

    def _specular_set(specular : soy.atoms.Color)
        _specular = specular.get4f()

    def _specular_weak(specular : Object)
        self._specular_obj = null

    prop specular : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._specular_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._specular)
                value.on_set.connect(self._specular_set)
                value.weak_ref(self._specular_weak)
                self._specular_obj = value
            return value
        set
            self._specular_set(value)
            if _specular_obj != null
                _specular_obj.on_set.disconnect(self._specular_set)
                _specular_obj.weak_unref(self._specular_weak)
            _specular_obj = value
            value.on_set.connect(self._specular_set)
            value.weak_ref(self._specular_weak)

    //
    // radius Property
    _radius : float
    prop radius : float
        get
            return _radius
        set
            if value < 0.0f
                _radius = 0.0f
            else if value > 180.0f
                _radius = 180.0f
            else
                _radius = value

    //
    // size Property
    _size : GLfloat
    prop size : float
        get
            return self._size
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._size = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()

            self.set_mass (self.density)

    //
    // texture Property
    _texture : soy.textures.Texture
    prop texture : soy.textures.Texture
        get
            return self._texture
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._texture = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _program : static GLuint
