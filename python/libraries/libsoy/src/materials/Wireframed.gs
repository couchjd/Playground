/*
 *  libsoy - soy.materials.Wireframed
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

class soy.materials.Wireframed : soy.materials.Material
    wireframe_glslv : static extern string
    wireframe_glslf : static extern string

    init
        draw_mode = GL_LINES

    def override enable (pass : int, mv : array of GLfloat, v : array of
                         GLfloat, p : array of GLfloat, lights : array of
                         soy.bodies.Light, scene_ambient : array of GLfloat
                         ) : bool
        // always 1-pass
        if pass > 0
            return false

        if _program is 0
            status : GLint
            vertex_shader : array of GLchar* = {Wireframed.wireframe_glslv.data}
            fragment_shader : array of GLchar* = {Wireframed.wireframe_glslf.data}
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

        return true

    ////////////////////////////////////////////////////////////////////////
    // Static

    _vertex_shader : static GLuint
    _fragment_shader : static GLuint
    _program : static GLuint
   
