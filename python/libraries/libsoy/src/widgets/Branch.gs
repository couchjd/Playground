/*
 *  libsoy - soy.widgets.Branch
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
    soy.atoms
    Gee
    GL
    GLib

class soy.widgets.Branch : soy.widgets.Container
    _children : list of Branch?
    name : string
    collapsed : bool
    _vbuffer : static GLuint // Vertex Buffer
    _ibuffer : static GLuint // Index Buffer
    _branchHeight : int = 20
    _branchWidth : int = 200
    _branchPosX : int
    _branchPosY : int
    _indentLength : int = 20
    _parent : soy.widgets.Container
    _shouldRender : bool
    _YDisp : int
    parent : soy.widgets.Container?

    // These verts form a 1x1 square with 2 tris (A and B) :
    //          3----2
    //          | B/ |
    //          | /A |
    //          0----1
    //
    //                                     px     py
    _verts : static array of GLfloat =  {-1.0f, -1.0f,  // 0,0
                                          1.0f, -1.0f,  // 1,0
                                          1.0f,  1.0f,  // 1,1
                                         -1.0f,  1.0f}  // 0,1

    //                                    face A    face B
    _faces : static array of GLushort = { 0, 1, 2, 2, 3, 0 }
    _program : static GLuint

    construct (name : string?)
        self.name = name
        self._children = new list of Branch?
        self.collapsed = false
        self._branchPosX = 0
        self._branchPosY = (int)self.convertY(0.0f)
        self._shouldRender = true
        self.parent = null


    def override add (parent : soy.widgets.Container)
        self.parent = parent
        if parent isa soy.widgets.Branch
            ((Branch)parent)._children.add(self)


    def override remove ()
        if self.parent isa soy.widgets.Branch
            ((Branch)parent)._children.remove(self)
        self.parent = null


    def remove_branch (oldBranch : soy.widgets.Branch)
        self._children.remove(oldBranch)


    def display()
        if self.collapsed
            print "+ %s", self.name
            return
        else
            print "- %s", self.name
            for child in self._children
                child.display()


    //convert y coordinate from mouse coord system to openGL coor system.
    def convertY (y : float) : float
        return self._parent.height - y - self._branchHeight


    def _calc_disp(rootY : int, y : int) : int
        self._YDisp = y
        for child in self._children
            child._branchPosX = self._branchPosX + self._indentLength
            if child._shouldRender
                self._YDisp += self._branchHeight + 5
                child._branchPosY = rootY - _YDisp
                self._YDisp += child._calc_disp(rootY,self._YDisp)
                // this might cause problems later on, maybe?
                // i thnk it should be called exactly how Container calls it.
                child.render(0,0,0,0)
        return self._YDisp - y


    def override render (x: int, y : int, width : int, height : int)
        if self.collapsed
            for child in self._children
                child._shouldRender = false
        else
            for child in self._children
                child._shouldRender = true


        if not self._shouldRender
            return

        var p = self._parent
        if not (p isa soy.widgets.Branch)
            self._calc_disp(self._branchPosY, 0)


        if _vbuffer == 0 or _ibuffer == 0
            //
            ///////////////////////////////////////
            // The Vertex and Index buffers are not initialized
            //
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _vbuffer = buffers[0]
            _ibuffer = buffers[1]
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer)
            glBufferData(GL_ARRAY_BUFFER, (GL.GLsizei) sizeof(GLfloat) * 8,
                         _verts, GL_STATIC_DRAW)
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer)
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                         (GL.GLsizei) sizeof(GLushort) * 6, _faces,
                         GL_STATIC_DRAW)
            // Setup shaders
            status : GLint
            vertex_shader : array of GLchar* = {Widget.basic_glslv.data}
            fragment_shader : array of GLchar* = {Widget.basic_glslf.data}
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
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer)

        glUseProgram(_program)
        color_loc : GLint = glGetUniformLocation(_program, "color")
        glUniform4f(color_loc, 1, 1, 1, 1)

        glViewport((GLint) _branchPosX, (GLint) _branchPosY,
                   (GLint) _branchWidth, (GLint) _branchHeight)

        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, (GLsizei) 0, null)
        glEnableVertexAttribArray(0)

        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        glDisableVertexAttribArray(0)

