/*
 *  libsoy - soy.scenes.Planar
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
    Gee
    ode


class soy.scenes.Planar : soy.scenes.Scene

    _offset : float
    _size : int = 200
    _planeID : ode.geoms.Plane
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    //_vercache : array of GLfloat // copy of vertex array (currently not used)

    construct (offset : float, material : soy.materials.Material?)
        super()

        // Setup for first render pass
        _ebo = 0
        _updated = true

        self.scale = 1.0f
        self.gravity = new soy.atoms.Vector(0.0f, -9.8f, 0.0f)
        self._offset = offset

        self._planeID = new ode.geoms.Plane (self.space,
                                             0.0f, 1.0f, 0.0f, self._offset)
        self._planeID.SetCategoryBits(GeomScene)
        self._planeID.SetData((void*) self)

        // Set the material of the plane
        if material is not null
            self._material = material
        else
            self._material = new soy.materials.Material()

        self.rotation = new array of GLfloat[9] = {1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f}
        self.position = new soy.atoms.Position()

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _material : soy.materials.Material
    prop material : soy.materials.Material
        get
            return _material
        set
            self._material = value

    _scale : float
    prop scale : float
        get
            return _scale
        set
            self._scale = value
            _updated = true

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override render_extra (view : array of GLfloat, projection : array of
                               GLfloat, camera : soy.bodies.Camera, lights :
                               array of soy.bodies.Light)

        // Lock so body cant be changed during render
        mutex.lock()

        // modelview matrix
        model_view : array of GLfloat[16] = new array of GLfloat[16]
        camera_model : array of GLfloat = camera.model_matrix()
        model_view[0]  = camera_model[0]
        model_view[1]  = camera_model[4]
        model_view[2]  = camera_model[8]
        model_view[3]  = 0.0f
        model_view[4]  = camera_model[1]
        model_view[5]  = camera_model[5]
        model_view[6]  = camera_model[9]
        model_view[7]  = 0.0f
        model_view[8]  = camera_model[2]
        model_view[9]  = camera_model[6]
        model_view[10] = camera_model[10]
        model_view[11] = 0.0f
        model_view[12] = -(camera_model[13] * camera_model[1])
        model_view[13] = -(camera_model[13] * camera_model[5])
        model_view[14] = -(camera_model[13] * camera_model[9])
        model_view[15] = 1.0f

        // Update ebo/vbo as needed
        if _updated
            _update_scene()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        // translate texture
        if _material isa soy.materials.Textured
            var m = ((soy.materials.Textured)_material)
            if m.colormap is not null
                m.colormap.translateX = camera_model[12]
                m.colormap.translateY = camera_model[14]
            if m.glowmap is not null
                m.glowmap.translateX = camera_model[12]
                m.glowmap.translateY = camera_model[14]
            if m.bumpmap is not null
                m.bumpmap.translateX = camera_model[12]
                m.bumpmap.translateY = camera_model[14]

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
        while self._material.enable(i, model_view, view, projection, lights,
                                    ambient.get4f())
            glDrawElements(GL_TRIANGLE_FAN, (GLsizei) 10, GL_UNSIGNED_BYTE,
                           (GLvoid*) 0)
            i++

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self._material.disable()

        // Rendering done, unlock
        mutex.unlock()

    def _update_scene ()
        //////////////////////////////////////////////////
        //
        //  Octagon representation
        //
        //
        //        3 ---------- 2
        //       /              \
        //      /                \
        //     /                  \
        //   4                     1
        //   |                     |
        //   |           0         | 
        //   |                     | 
        //   |                     |
        //   5                     8 
        //     \                 /
        //      \               / 
        //       \             /
        //        8-----------7  
        //
        //
        //
        //
        //


        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]


        // rendered as an octagon using triangle fan
        elements : array of GLubyte = new array of GLubyte[10]
        vertices : array of GLfloat = new array of GLfloat[9*11]

        for var i=0 to 8
            elements[i] = i
        elements[9] = 1

        vertices[0] = 0.0f
        vertices[1] = _offset
        vertices[2] = 0.0f
        vertices[3] = 0.0f
        vertices[4] = 1.0f
        vertices[5] = 0.0f
        vertices[6] = 0.0f
        vertices[7] = 0.0f
        vertices[8] = 1.0f
        vertices[9] = 0.0f
        vertices[10] = 0.0f

        for var i = 1 to 8
            vertices[11*i+0] = (GLfloat) (_size * cos((8-i) * 2*PI / 8))
            vertices[11*i+1] = (GLfloat) _offset
            vertices[11*i+2] = (GLfloat) (_size * sin((8-i) * 2*PI / 8))
            vertices[11*i+3] = (GLfloat) 0.0f
            vertices[11*i+4] = (GLfloat) 1.0f
            vertices[11*i+5] = (GLfloat) 0.0f
            vertices[11*i+6] = (GLfloat) vertices[11*i+0]
            vertices[11*i+7] = (GLfloat) vertices[11*i+2]
            vertices[11*i+8] = (GLfloat) 1.0f
            vertices[11*i+9] = (GLfloat) 0.0f
            vertices[11*i+10] = (GLfloat) 0.0f

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (sizeof(GLubyte)*10),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (sizeof(GLfloat)*9*11),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false
