/*
 *  libsoy - soy.bodies.Billboard
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

class soy.bodies.Billboard : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating

    construct (position : soy.atoms.Position?, size : soy.atoms.Size?,
               material : soy.materials.Material?)
        super(position, size, 0.0f)
        _updated = true
        if size is null
            _width = 1.0f
            _height = 1.0f
        else
            _width = (GLfloat) size.width
            _height = (GLfloat) size.height
            _size_obj = size
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            _material = default_material
        else
            _material = material


    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        if alpha_stage is not self._material.translucent
            return

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
            _update_billboard()

        // Re-bind buffers when not updating
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
        while self._material.enable(i, model_view, view, projection, lights,
                                    ambient)
            glDrawElements(GL_TRIANGLES, (GLsizei) 6, GL_UNSIGNED_BYTE,
                           (GLvoid*) 0)
            i++

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self._material.disable()

        // Render axis
        //renderAxis()

        // Rendering done, unlock
        mutex.unlock()


    def override set_mass (density : float)
        if density is not 0 and self.volume() is not 0.0f
            mass : ode.Mass = new ode.Mass()
            // TODO: this is temporary and must be fixed
            mass.SetBox(density, _width, _height, 0.1f)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

    def _update_billboard()

        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        elements : array of GLubyte = {
            0, 1, 2, 2, 1, 3
        }

        vertices : array of GLfloat = new array of GLfloat[56]

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j)*11] = _width * (j - 0.5f)
                vertices[(i*2+j)*11+1] = _height * (i - 0.5f)
                vertices[(i*2+j)*11+2] = 0
                vertices[(i*2+j)*11+3] = 0
                vertices[(i*2+j)*11+4] = 0
                vertices[(i*2+j)*11+5] = 1
                vertices[(i*2+j)*11+6] = j
                vertices[(i*2+j)*11+7] = 1-i
                vertices[(i*2+j)*11+8] = 1
                vertices[(i*2+j)*11+9] = 0
                vertices[(i*2+j)*11+10] = 0

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (6 * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (56 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Size Property
    _width  : GLfloat
    _height : GLfloat

    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        // Set size while locked to avoid potential rendering weirdness
        mutex.lock()
        _width = (GLfloat) size.width
        _height = (GLfloat) size.height
        _updated = true
        mutex.unlock()

    def _size_weak(size : Object)
        _size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) _width,
                                           (float) _height,
                                           (float) 0.0f)
                value.on_set.connect(self._size_set)
                value.weak_ref(self._size_weak)
                self._size_obj = value
            return value
        set
            self._size_set(value)
            _size_obj = value
            value.on_set.connect(self._size_set)
            value.weak_ref(self._size_weak)

    //
    // material property
    _material : soy.materials.Material
    prop material : soy.materials.Material?
        get
            if _material is default_material
                return null
            return _material
        set
            mutex.lock()
            // Use default material
            if value is null
                if default_material is null
                    default_material = new soy.materials.Material()
                _material = default_material

            // Use the provided material
            else
                _material = value
            mutex.unlock()

