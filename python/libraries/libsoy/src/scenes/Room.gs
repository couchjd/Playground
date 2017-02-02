/*
 *  libsoy - soy.scenes.Room
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
    ode
    GLib.Math

class soy.scenes.Room : soy.scenes.Scene
    planes : array of geoms.Geom
    _size : float
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating

    construct (size : float)
        // This is a scene which has 6 planes facing towards the center creating
        // a sort of room, which keeps objects within an area.
        planes = new array of geoms.Geom[6]
        planes[0] = new ode.geoms.Plane(super.space,  1.0f,  0.0f,  0.0f, -size)
        planes[1] = new ode.geoms.Plane(super.space,  0.0f,  1.0f,  0.0f, -size)
        planes[2] = new ode.geoms.Plane(super.space,  0.0f,  0.0f,  1.0f, -size)
        planes[3] = new ode.geoms.Plane(super.space, -1.0f,  0.0f,  0.0f, -size)
        planes[4] = new ode.geoms.Plane(super.space,  0.0f, -1.0f,  0.0f, -size)
        planes[5] = new ode.geoms.Plane(super.space,  0.0f,  0.0f, -1.0f, -size)
        for var i = 0 to 5
            planes[i].SetCategoryBits(1)
        _size = size
        _updated = true

    def override render_extra (view : array of GLfloat, projection : array of
                               GLfloat, camera : soy.bodies.Camera, lights :
                               array of soy.bodies.Light)
        if _walls is null
            return

        // Lock so body cant be changed during render
        mutex.lock()

        // modelview matrix
        model_view : array of GLfloat[16] = view

        // update ebo/vbo if its needed
        if _updated
            _update_walls()

        // rebind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), null)
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), (GLvoid*)
                              (sizeof(GLfloat) * 3))
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), (GLvoid*)
                              (sizeof(GLfloat) * 6))
        glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, (GLsizei)
                              (sizeof(GLfloat) * 11), (GLvoid*)
                              (sizeof(GLfloat) * 8))

        glEnableVertexAttribArray(0)
        glEnableVertexAttribArray(1)
        glEnableVertexAttribArray(2)
        glEnableVertexAttribArray(3)

        i : int = 0
        while self._walls.enable(i, model_view, view, projection, lights,
                                 ambient.get4f())
            glDrawElements(GL_TRIANGLES, (GLsizei) 36, GL_UNSIGNED_SHORT,
                           (GLvoid*) 0)
            i++

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self._walls.disable()

        // Release lock
        mutex.unlock()

    def _update_walls()

        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        elements : array of GLushort = new array of GLushort[36]

        for var k=0 to 5
            elements[k*6] = k*4
            elements[k*6+1] = k*4 + 1
            elements[k*6+2] = k*4 + 2
            elements[k*6+3] = k*4 + 2
            elements[k*6+4] = k*4 + 1
            elements[k*6+5] = k*4 + 3

        vertices : array of GLfloat = new array of GLfloat[264]

        // back

        // var voffset = 0  //(currently not used)
        // tangents already fixed by ubuntor2000

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j)*11] = _size * (2*j - 1)
                vertices[(i*2+j)*11+1] = _size * (2*i - 1)
                vertices[(i*2+j)*11+2] = -_size
                vertices[(i*2+j)*11+3] = 0
                vertices[(i*2+j)*11+4] = 0
                vertices[(i*2+j)*11+5] = 1
                vertices[(i*2+j)*11+6] = j
                vertices[(i*2+j)*11+7] = i
                vertices[(i*2+j)*11+8] = 1
                vertices[(i*2+j)*11+9] = 0
                vertices[(i*2+j)*11+10] = 0

        // front

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j+4)*11] = _size * (1 - 2*j)
                vertices[(i*2+j+4)*11+1] = _size * (2*i - 1)
                vertices[(i*2+j+4)*11+2] = _size
                vertices[(i*2+j+4)*11+3] = 0
                vertices[(i*2+j+4)*11+4] = 0
                vertices[(i*2+j+4)*11+5] = -1
                vertices[(i*2+j+4)*11+6] = 1.0f-j
                vertices[(i*2+j+4)*11+7] = i
                vertices[(i*2+j+4)*11+8] = -1
                vertices[(i*2+j+4)*11+9] = 0
                vertices[(i*2+j+4)*11+10] = 0

        // right

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j+8)*11] = _size
                vertices[(i*2+j+8)*11+1] = _size * (2*i - 1)
                vertices[(i*2+j+8)*11+2] = _size * (2*j - 1)
                vertices[(i*2+j+8)*11+3] = -1
                vertices[(i*2+j+8)*11+4] = 0
                vertices[(i*2+j+8)*11+5] = 0
                vertices[(i*2+j+8)*11+6] = j
                vertices[(i*2+j+8)*11+7] = i
                vertices[(i*2+j+8)*11+8] = 0
                vertices[(i*2+j+8)*11+9] = 0
                vertices[(i*2+j+8)*11+10] = 1

        // left

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j+12)*11] = -_size
                vertices[(i*2+j+12)*11+1] = _size * (1 - 2*i)
                vertices[(i*2+j+12)*11+2] = _size * (2*j - 1)
                vertices[(i*2+j+12)*11+3] = 1
                vertices[(i*2+j+12)*11+4] = 0
                vertices[(i*2+j+12)*11+5] = 0
                vertices[(i*2+j+12)*11+6] = 1.0f-j
                vertices[(i*2+j+12)*11+7] = i
                vertices[(i*2+j+12)*11+8] = 0
                vertices[(i*2+j+12)*11+9] = 0
                vertices[(i*2+j+12)*11+10] = -1

        // top

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j+16)*11] = _size * (2*j - 1)
                vertices[(i*2+j+16)*11+1] = _size
                vertices[(i*2+j+16)*11+2] = _size * (2*i - 1)
                vertices[(i*2+j+16)*11+3] = 0
                vertices[(i*2+j+16)*11+4] = -1
                vertices[(i*2+j+16)*11+5] = 0
                vertices[(i*2+j+16)*11+6] = j
                vertices[(i*2+j+16)*11+7] = i
                vertices[(i*2+j+16)*11+8] = 1
                vertices[(i*2+j+16)*11+9] = 0
                vertices[(i*2+j+16)*11+10] = 0

        // bottom

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j+20)*11] = _size * (2*j - 1)
                vertices[(i*2+j+20)*11+1] = -_size
                vertices[(i*2+j+20)*11+2] = _size * (1 - 2*i)
                vertices[(i*2+j+20)*11+3] = 0
                vertices[(i*2+j+20)*11+4] = 1
                vertices[(i*2+j+20)*11+5] = 0
                vertices[(i*2+j+20)*11+6] = j
                vertices[(i*2+j+20)*11+7] = 1.0f - i
                vertices[(i*2+j+20)*11+8] = 1
                vertices[(i*2+j+20)*11+9] = 0
                vertices[(i*2+j+20)*11+10] = 0

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (36 * sizeof(GLushort)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (264 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    // walls property
    _walls : soy.materials.Material
    prop walls : soy.materials.Material
        get
            return _walls
        set
            mutex.lock()
            _walls = value
            mutex.unlock()
