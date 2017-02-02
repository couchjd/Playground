/*
 *  libsoy - soy.widgets.Canvas
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
    soy.atoms
    soy.textures

class soy.widgets.Canvas : soy.widgets.Widget
    canvas_glslv : static extern string
    canvas_glslf : static extern string

    alignWidth   : int
    alignHeight  : int
    aspect       : float
    marginTop    : int
    marginLeft   : int
    marginRight  : int
    marginBottom : int

    // These verts form a 1x1 square with 2 tris (A and B) :
    //          3----2
    //          | B/ |
    //          | /A |
    //          0----1
    //
    //                                     px     py    tx    ty
    _verts : static array of GLfloat =  {-1.0f, -1.0f, 0.0f, 1.0f,  // 0,0
                                          1.0f, -1.0f, 1.0f, 1.0f,  // 1,0
                                          1.0f,  1.0f, 1.0f, 0.0f,  // 1,1
                                         -1.0f,  1.0f, 0.0f, 0.0f}  // 0,1

    //                                    face A    face B
    _faces : static array of GLushort = { 0, 1, 2, 2, 3, 0 }
    _program : static GLuint

    vbuffer : GLuint // Vertex Buffer
    ibuffer : GLuint // Index Buffer

    construct (texture : soy.textures.Texture?)
        self._texture = texture


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override add (parent : soy.widgets.Container)
        self.size = parent.size
        self.width = parent.width
        self.height = parent.height

    def override remove ()
        self.size = new soy.atoms.Size(0, 0, 0)
    
    def override render (x: int, y : int, width : int, height : int)
#if !WINDOWS
        // don't bother rendering w/o a texture
        if _texture == null
            return

        // Setup and Use VBOs
        if vbuffer == 0 or ibuffer == 0
            //
            ///////////////////////////////////////
            // The Vertex and Index buffers are not initialized
            //
            // Generate, Bind, and upload to the buffers
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            vbuffer = buffers[0]
            ibuffer = buffers[1]
            glBindBuffer(GL_ARRAY_BUFFER, vbuffer)
            glBufferData(GL_ARRAY_BUFFER, (GL.GLsizei) sizeof(GLfloat) * 20, _verts,
                         GL_STATIC_DRAW)
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibuffer)
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                         (GL.GLsizei) sizeof(GLushort) * 6, _faces, GL_STATIC_DRAW)
            // Setup shaders
            status : GLint
            vertex_shader : array of GLchar* = {Canvas.canvas_glslv.data}
            fragment_shader : array of GLchar* = {Canvas.canvas_glslf.data}
            // initialize vertex shader
            vertex_shader_id : GLuint = glCreateShader(GL_VERTEX_SHADER)
            glShaderSource(vertex_shader_id, 1, vertex_shader, {-1})
            glCompileShader(vertex_shader_id)

            // check compile status
            glGetShaderiv(vertex_shader_id, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize fragment shader
            fragment_shader_id : GLuint = glCreateShader(GL_FRAGMENT_SHADER)
            glShaderSource(fragment_shader_id, 1, fragment_shader, {-1})
            glCompileShader(fragment_shader_id)

            // check compile status
            glGetShaderiv(fragment_shader_id, GL_COMPILE_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // initialize program
            _program = glCreateProgram()
            glAttachShader(_program, vertex_shader_id)
            glAttachShader(_program, fragment_shader_id)
            glBindAttribLocation(_program, 0, "vertex")
            glBindAttribLocation(_program, 2, "texcoord")
            glLinkProgram(_program)

            // check link status
            glGetProgramiv(_program, GL_LINK_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // cleanup
            glDetachShader(_program, vertex_shader_id)
            glDeleteShader(vertex_shader_id)
            glDetachShader(_program, fragment_shader_id)
            glDeleteShader(fragment_shader_id)

        else
            //
            // Just use the buffers that have been previously created
            glBindBuffer(GL_ARRAY_BUFFER, vbuffer)
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibuffer)

        glUseProgram(_program)
        glActiveTexture(GL_TEXTURE0)
        tex_loc : GLint = glGetUniformLocation(_program, "tex")
        glUniform1i(tex_loc, 0)

        tc_loc : GLint = glGetUniformLocation(_program, "tc_matrix")
        glUniformMatrix4fv(tc_loc, 1, GL_FALSE, _texture.texture_matrix())
        
        scale : float = _scaleX
        Sw : float = 1.0f
        
        if _keep_aspect
            scale *= _texture.aspect
            Sw = (float)height / (float)width
        
        var _mtx = new array of GLfloat[16]
        _c : float = (float)cos(_rotation)
        _s : float = (float)sin(_rotation)
        _mtx[0]  = _c * scale * Sw
        _mtx[1]  = _s * scale
        _mtx[2]  = 0.0f
        _mtx[3]  = 0.0f
        _mtx[4]  = -_s * _scaleY * Sw
        _mtx[5]  = _c * _scaleY
        _mtx[6]  = 0.0f
        _mtx[7]  = 0.0f
        _mtx[8]  = 0.0f
        _mtx[9]  = 0.0f
        _mtx[10] = 1.0f
        _mtx[11] = 0.0f
        _mtx[12] = _x * Sw + _align * (1.0f - scale * Sw)
        _mtx[13] = _y
        _mtx[14] = 0.0f
        _mtx[15] = 1.0f
        
        m_loc : GLint = glGetUniformLocation(_program, "m_matrix")
        glUniformMatrix4fv(m_loc, 1, GL_FALSE, _mtx)
        
        //
        // Set the viewport to the current Widget position and size
        //TODO: This needs to calculate the actual dimensions instead of using the
        //       size fractions passed to this function
        glViewport((GLint) x, (GLint) y, (GLint) width, (GLint) height)

        self._texture.enable()
        
        if self._texture.translucent
            glEnable(GL_BLEND)
            glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glDisable(GL_DEPTH_TEST)

        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 4), null)
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 4), (GLvoid*)
                              (sizeof(GLfloat) * 2))

        glEnableVertexAttribArray(0)
        glEnableVertexAttribArray(2)
        
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(2)

        if self._texture.translucent
            glDisable(GL_BLEND)
        glEnable(GL_DEPTH_TEST)
        
        self._texture.disable()
#else
        print "Canvas: glext functions not currently supported on Windows"
#endif


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // texture property
    _texture : soy.textures.Texture?

    prop texture : soy.textures.Texture?
        get
            return _texture
        set
            _texture = value

    //
    // x property
    _x : float = 0.0f

    prop x : float
        get
            return _x
        set
            _x = value

    //
    // y property
    _y : float = 0.0f

    prop y : float
        get
            return _y
        set
            _y = value

    //
    // scaleX property
    _scaleX : float = 1.0f

    prop scaleX : float
        get
            return _scaleX
        set
            _scaleX = value

    //
    // scaleY property
    _scaleY : float = 1.0f

    prop scaleY : float
        get
            return _scaleY
        set
            _scaleY = value

    //
    // keep_aspect property
    _keep_aspect : bool = false

    prop keep_aspect : bool
        get
            return _keep_aspect
        set
            _keep_aspect = value

    //
    // align property
    _align : float = 0.0f

    prop align : float
        get
            return _align
        set
            _align = value

    //
    // rotation property
    _rotation : float = 0.0f

    prop rotation : float
        get
            return _rotation
        set
            _rotation = value
