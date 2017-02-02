/*
 *  libsoy - soy.widgets.HScroll
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


class soy.widgets.HScroll : soy.widgets.Scroller
    _viewPort : soy.atoms.Size
    _hasBar : bool
    _vbuffer : static GLuint // Vertex Buffer
    _ibuffer : static GLuint // Index Buffer
    _totalWidth : float
    _scrollWidth : float
    _testpos : soy.atoms.Position

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

    construct ()
        _viewPort = new soy.atoms.Size(self.size.width, self.size.height)
        _hasBar = false
        _testpos = new soy.atoms.Position()
        self.scrollPosition = new soy.atoms.Position()


    def override render (x: int, y : int, width : int, height : int)
#if !WINDOWS
        // Render each child widget in order
        var _x = x
        var _y = y
        for widget in self.children
            widget.render(_x, _y, widget.width, widget.height)
            _x += widget.width

        if not _hasBar
            return

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
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer)
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer)

        glUseProgram(_program)
        color_loc : GLint = glGetUniformLocation(_program, "color")
        glUniform4f(color_loc, 1, 1, 1, 1)

        //viewport of the entire scrollbar
        glViewport((GLint) 0, (GLint) 0, (GLint) _viewPort.width, (GLint)
                   self.scrollbarThickness)

        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, (GLsizei) 0, null)
        glEnableVertexAttribArray(0)

        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        glUniform4f(color_loc, 0, 1, 0, 1)

        //viewport of the scroll itself
        var viewPort2Width = 0.0
        if self.size.width < _totalWidth
            viewPort2Width = self.size.width/ _totalWidth * self.size.width
        glViewport((GLint) self.scrollPosition.x, (GLint) 0,
                   (GLint) viewPort2Width, (GLint) self.scrollbarThickness)
        //glViewport((GLint) _testpos.x, (GLint) _testpos.y, (GLint) 10, (GLint) 10)

        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        glDisableVertexAttribArray(0)
#else
        print "HScroll: glext not currently supported on Windows"
#endif


    def override resize_children (x: int, y : int, width : int, height : int)
        _totalWidth = 0.0f
        for widget in self.children
            //increment total width with each child's width
            _totalWidth += widget.size.width
            //truncate children's height if it's greater than widget's
            if widget.size.height > self.size.height
                widget.size.height = self.size.height

        //if total content width is greater than widget's width, the bar is needed
        if _totalWidth > self.size.width
            _hasBar = true
            for widget in self.children
                //reduces the children's width, if needed, to fit the scrollbar
                if widget.size.height >= self.size.height - self.scrollbarThickness
                    widget.size.height -= self.scrollbarThickness

        // Change the viewPort only if widgets total size are greater than HScroll size
        var viewPortWidth = 0.0f
        if _hasBar
            viewPortWidth = self.size.width
        else
            viewPortWidth = _totalWidth

        var viewPortHeight = 0.0f
        if _hasBar
            viewPortHeight = self.size.height - self.scrollbarThickness
        else
            viewPortHeight = self.size.height


        _viewPort = new soy.atoms.Size(viewPortWidth, viewPortHeight)

        // The width of the scroll. Determined by the scrollbar width divided by
        // the total content width. If widget width is greater or equal than
        // total content width, scroll width is 0.
        if self.size.width >= _totalWidth
            _scrollWidth = 0
        else
            _scrollWidth =  (self.size.width / _totalWidth *
                                  self.size.width)

        //print "scroll Width: %f" , _scrollWidth
        //print "total Width: %f", _totalWidth
        //print "viewport Width: %f", _viewPort.width

        //left-bottom position. in the case of hscroll, position is at (0, max_height)
        //print ("parent height %f", self.parent.height)
        self.scrollPosition.x = 0.0f
        self.scrollPosition.y = 0.0f
        //print "Bar X, Y = %f, %f", 0.0, self.size.height
        //print "Bar width x height = %.2fx%.2f", _scrollWidth, self.scrollbarThickness
        self.scrollbarSize = new soy.atoms.Size(_scrollWidth,
                                                self.scrollbarThickness)


    def override motion_handler (e: events.Motion)
        _testpos.x = (float) e.x
        _testpos.y = (float) (-e.y + self.parent.height)
        if drag
            print "e.x: %f   e.y: %f", e.x, e.y
            var offset = (float) e.x - self.xstartdrag
            self.scrollPosition.x = self.xpos_startdrag + offset

            self.scrollPosition.x = float.max(self.scrollPosition.x, 0.0f)
            self.scrollPosition.x = float.min(self.scrollPosition.x,
                                              (_viewPort.width -
                                               _scrollWidth))


    def override scroll_handler(e : events.Scroll)
        case e.direction
            when soy.ScrollDirection.Left
                self.scrollPosition.x -= 10
                self.scrollPosition.x = float.max(self.scrollPosition.x, 0.0f)
            when soy.ScrollDirection.Right
                self.scrollPosition.x += 10
                self.scrollPosition.x = float.min(self.scrollPosition.x,
                                                  (_viewPort.width -
                                                   _scrollWidth))

