/*
 *  libsoy - soy.materials.Material
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
    GL
    Gee


class soy.materials.Material : Object
    basic_glslv : static extern string
    basic_glslf : static extern string

    translucent : bool
    draw_mode : GLenum

    init
        translucent = false
        draw_mode = GL_TRIANGLES

    def virtual enable (pass : int, mv : array of GLfloat, v : array of
                        GLfloat, p : array of GLfloat, lights : array of
                        soy.bodies.Light, scene_ambient : array of GLfloat
                        ) : bool
        if pass*8 >= lights.length and pass is not 0
            return false

        if _program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Material.basic_glslv.data}
            fragment_shader : array of GLchar* = {Material.basic_glslf.data}
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

        return true

    def virtual disable ()
        glDisable(GL_BLEND)
        return

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _program : static GLuint
