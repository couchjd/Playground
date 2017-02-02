/*
 *  libsoy - soy.materials.Textured
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

class soy.materials.Textured : soy.materials.Colored
    texture_glslv : static extern string
    texture_glslf : static extern string

    // This simplifies rendering code
    _ids : static array of GLenum = {
        GL_TEXTURE0, // reserved for _dummy
        GL_TEXTURE1, // reserved for _dummy_cube
        GL_TEXTURE2, // reserved for _dummp_bump
        GL_TEXTURE3,
        GL_TEXTURE4,
        GL_TEXTURE5,
        GL_TEXTURE6,
        GL_TEXTURE7
    }

    // This ensures the texture property isnt changed while rendering it.
    _mutex : Mutex


    init
        _mutex = Mutex()


    construct (name : string? = null,
               bumpmap : soy.textures.Texture?,
               colormap : soy.textures.Texture?,
               glowmap : soy.textures.Texture?)
        super(name)
        _bumpmap = bumpmap
        _colormap = colormap
        _glowmap = glowmap

        if _colormap is not null
            translucent = _colormap.translucent


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override enable (pass : int, mv : array of GLfloat, v : array of
                         GLfloat, p : array of GLfloat, lights : array of
                         soy.bodies.Light, scene_ambient : array of GLfloat
                         ) : bool
        if pass*8 >= lights.length and pass is not 0
            return false

        id : int = 3
        if _program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Textured.texture_glslv.data}
            fragment_shader : array of GLchar* = {Textured.texture_glslf.data}
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
            glBindAttribLocation(_program, 1, "normal")
            glBindAttribLocation(_program, 2, "texcoord")
            glBindAttribLocation(_program, 3, "tangent")
            glLinkProgram(_program)

            // check link status
            glGetProgramiv(_program, GL_LINK_STATUS, out status)
            assert status is not (GLint) GL_FALSE

            // cleanup
            glDetachShader(_program, _vertex_shader)
            glDeleteShader(_vertex_shader)
            glDetachShader(_program, _fragment_shader)
            glDeleteShader(_fragment_shader)
        glUseProgram(_program)
        mv_loc : GLint = glGetUniformLocation(_program, "mv_matrix")
        glUniformMatrix4fv(mv_loc, 1, GL_FALSE, mv)
        p_loc : GLint = glGetUniformLocation(_program, "p_matrix")
        glUniformMatrix4fv(p_loc, 1, GL_FALSE, p)
        sa_loc : GLint = glGetUniformLocation(_program, "scene_ambient")
        glEnable(GL_BLEND)
        if pass is 0
            glUniform4fv(sa_loc, 1, scene_ambient)
            glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        else
            glUniform4f(sa_loc, 0.0f, 0.0f, 0.0f, 0.0f)
            glBlendFunc(GL_ONE, GL_ONE)
        ld_loc : GLint = glGetUniformLocation(_program, "light_diffuse")
        ls_loc : GLint = glGetUniformLocation(_program, "light_specular")
        lp_loc : GLint = glGetUniformLocation(_program, "light_pos")
        ln_loc : GLint = glGetUniformLocation(_program, "light_num")
        lights_diffuse : array of GLfloat[32] = new array of GLfloat[32]
        lights_specular : array of GLfloat[32] = new array of GLfloat[32]
        lights_pos : array of GLfloat[24] = new array of GLfloat[24]
        light_num : int = 8
        for var i = 0 to 7
            if i >= lights.length
                light_num = i
                break
            light : unowned soy.bodies.Light = lights[pass*8+i]
            diffuse : array of GLfloat = light.diffuse.get4f()
            specular : array of GLfloat = light.specular.get4f()
            lights_diffuse[i*4] = diffuse[0]
            lights_diffuse[i*4+1] = diffuse[1]
            lights_diffuse[i*4+2] = diffuse[2]
            lights_diffuse[i*4+3] = diffuse[3]
            lights_specular[i*4] = specular[0]
            lights_specular[i*4+1] = specular[1]
            lights_specular[i*4+2] = specular[2]
            lights_specular[i*4+3] = specular[3]
            lights_pos[i*3] = (light.position.x*v[0]+light.position.y*v[4]+
                               light.position.z*v[8]+v[12])
            lights_pos[i*3+1] = (light.position.x*v[1]+light.position.y*v[5]+
                                 light.position.z*v[9]+v[13])
            lights_pos[i*3+2] = (light.position.x*v[2]+light.position.y*v[6]+
                                 light.position.z*v[10]+v[14])
        glUniform4fv(ld_loc, 8, lights_diffuse)
        glUniform4fv(ls_loc, 8, lights_specular)
        glUniform3fv(lp_loc, 8, lights_pos)
        glUniform1i(ln_loc, light_num)
        ma_loc : GLint = glGetUniformLocation(_program, "mat_ambient")
        glUniform4fv(ma_loc, 1, ambient.get4f())
        md_loc : GLint = glGetUniformLocation(_program, "mat_diffuse")
        glUniform4fv(md_loc, 1, diffuse.get4f())
        ms_loc : GLint = glGetUniformLocation(_program, "mat_specular")
        glUniform4fv(ms_loc, 1, specular.get4f())
        me_loc : GLint = glGetUniformLocation(_program, "mat_emission")
        glUniform4fv(me_loc, 1, emission.get4f())
        msh_loc : GLint = glGetUniformLocation(_program, "mat_shininess")
        glUniform1f(msh_loc, shininess)

        glActiveTexture(_ids[0])
        _dummy.enable()
        glActiveTexture(_ids[1])
        _dummy_cube.enable()
        glActiveTexture(_ids[2])
        _dummy_bump.enable()

        identity : array of GLfloat = {
            1.0f, 0.0f, 0.0f, 0.0f,
            0.0f, 1.0f, 0.0f, 0.0f,
            0.0f, 0.0f, 1.0f, 0.0f,
            0.0f, 0.0f, 0.0f, 1.0f
        }
        tc_loc : GLint = glGetUniformLocation(_program, "tc_matrix")
        glUniformMatrix4fv(tc_loc, 1, GL_FALSE, identity)
        tg_loc : GLint = glGetUniformLocation(_program, "tg_matrix")
        glUniformMatrix4fv(tg_loc, 1, GL_FALSE, identity)
        tb_loc : GLint = glGetUniformLocation(_program, "tb_matrix")
        glUniformMatrix4fv(tb_loc, 1, GL_FALSE, identity)

        cmc_loc : GLint = glGetUniformLocation(_program, "colormap_cube")
        cm_loc : GLint = glGetUniformLocation(_program, "colormap")
        glUniform1i(cmc_loc, 1)
        glUniform1i(cm_loc, 0)
        if _colormap is not null
            if _colormap isa soy.textures.Cubemap
                glUniform1i(cmc_loc, id)
            else
                glUniform1i(cm_loc, id)
                glUniformMatrix4fv(tc_loc, 1, GL_FALSE,
                                   _colormap.texture_matrix())
            self.enable_colormap(id++, null)

        gmc_loc : GLint = glGetUniformLocation(_program, "glowmap_cube")
        gm_loc : GLint = glGetUniformLocation(_program, "glowmap")
        glUniform1i(gmc_loc, 1)
        glUniform1i(gm_loc, 0)
        if _glowmap is not null
            if _glowmap isa soy.textures.Cubemap
                glUniform1i(gmc_loc, id)
            else
                glUniform1i(gm_loc, id)
                 glUniformMatrix4fv(tg_loc, 1, GL_FALSE,
                                   _glowmap.texture_matrix())
            self.enable_glowmap(id++, null)

        bmc_loc : GLint = glGetUniformLocation(_program, "bumpmap_cube")
        bm_loc : GLint = glGetUniformLocation(_program, "bumpmap")
        glUniform1i(bmc_loc, 1)
        glUniform1i(bm_loc, 2)
        if _bumpmap is not null
            if _bumpmap isa soy.textures.Cubemap
                glUniform1i(bmc_loc, id)
                glUniform1i(bm_loc, 0)
            else
                glUniform1i(bm_loc, id)
                glUniformMatrix4fv(tb_loc, 1, GL_FALSE,
                                   _bumpmap.texture_matrix())
            self.enable_bumpmap(id++, null)

        return true

    def override disable ()
        id : int = 0
        self.disable_texture(id++, null, _dummy)
        self.disable_texture(id++, null, _dummy_cube)
        self.disable_texture(id++, null, _dummy_bump)
        self.disable_texture(id++, null, _colormap)
        self.disable_texture(id++, null, _glowmap)
        self.disable_texture(id++, null, _bumpmap)
        glDisable(GL_BLEND)

    def enable_bumpmap (id : int, texmatrix : ode.Matrix3?)
        // Enable Texture
        if _bumpmap is not null
            glActiveTexture(_ids[id])
            _bumpmap.enable()


    def enable_colormap (id : int, texmatrix : ode.Matrix3?)
        if _colormap is not null
            glActiveTexture(_ids[id])
            _colormap.enable()


    def enable_glowmap (id : int, texmatrix : ode.Matrix3?)
        if _glowmap is not null
            // Enable Texture
            glActiveTexture(_ids[id])
            _glowmap.enable()


    def disable_texture(id : int, texmatrix : ode.Matrix3?,
                               texture : soy.textures.Texture?)
        if texture is not null
            texture.disable()


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // bumpmap property
    _bumpmap : soy.textures.Texture?

    prop bumpmap : soy.textures.Texture?
        get
            return _bumpmap
        set
            _mutex.lock()
            _bumpmap = value
            _mutex.unlock()

    //
    // colormap property
    _colormap : soy.textures.Texture?

    prop colormap : soy.textures.Texture?
        get
            return _colormap
        set
            _mutex.lock()
            _colormap = value
            _mutex.unlock()

    //
    // glowmap property
    _glowmap : soy.textures.Texture?

    prop glowmap : soy.textures.Texture?
        get
            return _glowmap
        set
            _mutex.lock()
            _glowmap = value
            _mutex.unlock()

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _program : static GLuint
    _dummy : static soy.textures.Texture
    _dummy_cube : static soy.textures.Cubemap
    _dummy_bump : static soy.textures.Texture

    init static
        _dummy = new soy.textures.Texture()
        _dummy.resize(4,1,1)
        _dummy[0] = new soy.atoms.Color.named("black")
        _dummy[0].alpha = 0
        _dummy_cube = new soy.textures.Cubemap()
        _dummy_cube.up = _dummy
        _dummy_cube.down = _dummy
        _dummy_cube.left = _dummy
        _dummy_cube.right = _dummy
        _dummy_cube.front = _dummy
        _dummy_cube.back = _dummy
        _dummy_bump = new soy.textures.Texture()
        _dummy_bump.resize(3,1,1)
        _dummy_bump[0] = new soy.atoms.Color(128,128,255)
