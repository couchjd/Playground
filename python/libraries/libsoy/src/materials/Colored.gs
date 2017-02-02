/*
 *  libsoy - soy.materials.Colored
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


class soy.materials.Colored : soy.materials.Material
    color_glslv : static extern string
    color_glslf : static extern string

    init
        self._ambient = {0.5f, 0.5f, 0.5f, 1.0f}
        self._diffuse = {0.8f, 0.8f, 0.8f, 1.0f}
        self._specular = {1.0f, 1.0f, 1.0f, 0.0f}
        self._emission = {0.0f, 0.0f, 0.0f, 0.0f}
        self._shininess = 32.0f


    construct (name : string? = null)
        super()

        // If name was not provided, we're good.
        if name is null
            return

        // If we have a named material, use it
        if _map.has_key(name)
            ambient : string
            diffuse : string
            specular : string
            emission : string
            shine : string
            words : array of string = _map[name].split(" ")
            (ambient, diffuse, specular, emission, shine) = words
            self.ambient = new soy.atoms.Color.named(ambient)
            self.diffuse = new soy.atoms.Color.named(diffuse)
            self.specular = new soy.atoms.Color.named(specular)
            self.emission = new soy.atoms.Color.named(emission)
            self._shininess = (float) double.parse(shine)

        // Otherwise base it on a named color
        else
            self.ambient = new soy.atoms.Color.named(name)
            self.diffuse = new soy.atoms.Color.named(name)
            self.specular = new soy.atoms.Color.named("grey")
            self.emission = new soy.atoms.Color.named("black")

        translucent = _diffuse[3] is not 255


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override enable (pass : int, mv : array of GLfloat, v : array of
                         GLfloat, p : array of GLfloat, lights : array of
                         soy.bodies.Light, scene_ambient : array of GLfloat
                         ) : bool
        if pass*8 >= lights.length and pass is not 0
            return false

        if _program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Colored.color_glslv.data}
            fragment_shader : array of GLchar* = {Colored.color_glslf.data}
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
        glUniform4fv(ma_loc, 1, _ambient)
        md_loc : GLint = glGetUniformLocation(_program, "mat_diffuse")
        glUniform4fv(md_loc, 1, _diffuse)
        ms_loc : GLint = glGetUniformLocation(_program, "mat_specular")
        glUniform4fv(ms_loc, 1, _specular)
        me_loc : GLint = glGetUniformLocation(_program, "mat_emission")
        glUniform4fv(me_loc, 1, _emission)
        msh_loc : GLint = glGetUniformLocation(_program, "mat_shininess")
        glUniform1f(msh_loc, _shininess)

        return true

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // ambient property
    _ambient : array of GLfloat
    _ambient_obj : weak soy.atoms.Color?

    def _ambient_set(color : soy.atoms.Color)
        self._ambient = color.get4f()

    def _ambient_weak(color : Object)
        self._ambient_obj = null

    prop ambient : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _ambient_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_ambient)
                ret.on_set.connect(self._ambient_set)
                ret.weak_ref(self._ambient_weak)
                _ambient_obj = ret
            return ret
        set
            _ambient = value.get4f()
            _ambient_obj = value
            value.on_set.connect(self._ambient_set)
            value.weak_ref(self._ambient_weak)

    //
    // diffuse property
    _diffuse : array of GLfloat
    _diffuse_obj : weak soy.atoms.Color?

    def _diffuse_set(color : soy.atoms.Color)
        self._diffuse = color.get4f()

    def _diffuse_weak(color : Object)
        self._diffuse_obj = null

    prop diffuse : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _diffuse_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_diffuse)
                ret.on_set.connect(self._diffuse_set)
                ret.weak_ref(self._diffuse_weak)
                _diffuse_obj = ret
            return ret
        set
            _diffuse = value.get4f()
            _diffuse_obj = value
            value.on_set.connect(self._diffuse_set)
            value.weak_ref(self._diffuse_weak)

    //
    // specular property
    _specular : array of GLfloat
    _specular_obj : weak soy.atoms.Color?

    def _specular_set(color : soy.atoms.Color)
        self._specular = color.get4f()

    def _specular_weak(color : Object)
        self._specular_obj = null

    prop specular : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _specular_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_specular)
                ret.on_set.connect(self._specular_set)
                ret.weak_ref(self._specular_weak)
                _specular_obj = ret
            return ret
        set
            _specular = value.get4f()
            _specular_obj = value
            value.on_set.connect(self._specular_set)
            value.weak_ref(self._specular_weak)

    //
    // emission property
    _emission : array of GLfloat
    _emission_obj : weak soy.atoms.Color?

    def _emission_set(color : soy.atoms.Color)
        self._emission = color.get4f()

    def _emission_weak(color : Object)
        self._emission_obj = null

    prop emission : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _emission_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_emission)
                ret.on_set.connect(self._emission_set)
                ret.weak_ref(self._emission_weak)
                _emission_obj = ret
            return ret
        set
            _emission = value.get4f()
            _emission_obj = value
            value.on_set.connect(self._emission_set)
            value.weak_ref(self._emission_weak)

    //
    // shininess property
    _shininess : float
    prop shininess : float
        get
            return _shininess
        set
            _shininess = value

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _program : static GLuint

    _map : static dict of string, string
    init static
        // _map format: "ambient diffuse specular emission shininess"
        _map = new dict of string, string
        _map["bronze"] = "#3F2510 #663C1A #C57433 black 76"
        _map["chrome"] = "#3F3F3F #666666 #C5C5C5 black 76"
        _map["copper"] = "#3A1607 #8C3610 #943811 black 51"
        _map["gold"] = "#3F3A13 #BF9A39 #A08D5D black 51"
        _map["polishedgold"] = "#3F3910 #585017 #CBB835 black 83"
        _map["silver"] = "#3A3A3A #464646 #C5C5C5 black 89"
