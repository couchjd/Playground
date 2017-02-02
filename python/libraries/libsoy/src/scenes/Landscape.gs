/*
 *  libsoy - soy.scenes.Landscape
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


class soy.scenes.Landscape : soy.scenes.Scene
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    _vertArray : array of GLfloat
    _faceArray : array of GLushort
    _heightfieldData : ode.geoms.HeightfieldData
    _geomID : ode.geoms.Heightfield

    construct (heightmap : soy.textures.Texture, mat : soy.materials.Material,
               detail : int = 1,
               size : soy.atoms.Size?,
               position : soy.atoms.Position?)
        assert heightmap.channels is 1

        self._map = heightmap
        self._material = mat

        if size is null
            self._size = new soy.atoms.Size (1024, 16, 1024)
        else
            self._size = size

        if position is null
            self._pos = new soy.atoms.Position ()
        else
            self._pos = position

        // Setup for first render pass
        self._updated = true

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _material : soy.materials.Material
    prop material : soy.materials.Material
        get
            return _material
        set
            self._material = value

    _pos : soy.atoms.Position
    prop new position : soy.atoms.Position
        get
            return _pos
        set
            self._pos = value

    _size : soy.atoms.Size
    prop size : soy.atoms.Size
        get
            return _size
        set
            self._size = value

    _map : soy.textures.Texture
    prop heightmap : soy.textures.Texture
        get
            return _map
        set
            self._map = value
            self._updated = true


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def _update_landscape ()
        //
        // Each texel represents a vertex:
        // (3x3 texture, viewed from above)
        //
        // 0----1----2
        // |    |    |
        // |    |    |
        // 3----4----5
        // |    |    |
        // |    |    |
        // 6----7----8
        //

        // on the first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

//        deltaCols, deltaRows : float *
//        maxDelta, minDelta : float

        v1 : array of double = new array of double[3]
        v2 : array of double = new array of double[3]
        normal : array of double = new array of double[3]
        length : double

        self._heightfieldData = new ode.geoms.HeightfieldData()

        self._vertArray = new array of GLfloat[((int)_map.size.width) * ((int)_map.size.height) * 11]
        self._faceArray = new array of GLushort[((int)_map.size.width-1) * ((int)_map.size.height-1) * 6]

        self._heightfieldData.BuildByte(_map.texels,
                                        0,                          // copy?
                                        _size.width,                // width
                                        _size.depth,                // depth
                                        (int) _map.size.width,      // dataX
                                        (int) _map.size.height,     // dataY
                                        (Real) (1.0f / 255.0f *
                                                _size.height),      // scale
                                        0,                          // offset
                                        (Real) 4.0f,                // thick
                                        0                           // wrapped
                                       )

        self._geomID = new ode.geoms.Heightfield(space, _heightfieldData, 1)
        self._geomID.SetPosition(_pos.x, _pos.y, _pos.z)

        // Alloc _delta arrays
        //
        //   These are arrays for column and row edge deltas:
        //     . . . . . . . .    ._._._._._._._.
        //     | | | | | | | | < delta
        //     . . . . . . . .    ._._._._._._._.
        //     | | | | | | | |         ^delta
        //     . . . . . . . .    ._._._._._._._.
        //        deltaCols          deltaRows
        //
        //   They're used in determining edge collapses in LOD generation below.
//        deltaCols = new array of float[((int)_map.size.width) * ((int)_map.size.height)]
//        deltaRows = new array of float[((int)_map.size.width) * ((int)_map.size.height)]

        // Calculate positions and texcoords first
        for var i = 0 to (_map.size.height - 1)
            for var j = 0 to (_map.size.width - 1)
                var l = (int)_map.size.width * i + j
                _vertArray[l * 11]     = (j / (_map.size.width - 1.0f) - 0.5f) * _size.width
                _vertArray[l * 11 + 1] = (_map.texels[l] / 255.0f) * _size.height
                _vertArray[l * 11 + 2] = (i / (_map.size.height - 1.0f) - 0.5f)  * _size.depth
                // all below need to be calculated CORRECTLY!
                _vertArray[l * 11 + 6] = j                         // * texture scale
                _vertArray[l * 11 + 7] = i                         // * texture scale
                // _vertArray[l].texcoord.z = _map.texels[l] / 255.0f

        // Normals and tangents calculated second because they depend on position
        for var i = 0 to (_map.size.height - 1)
            for var j = 0 to (_map.size.width - 1)
                var offset = (int)_map.size.width * i + j

                //   u     c = current vert
                //   |     u/d/l/r = up/down/left/right vert
                // l-c-r
                //   |     vector1 = lr
                //   d     vector2 = ud
                var u = offset - (int)_map.size.width
                var d = offset + (int)_map.size.width
                var l = offset - 1
                var r = offset + 1
                var c = offset

                // check if we are at the boundaries
                if i is 0
                    u = c
                if i is (_map.size.height - 1)
                    d = c
                if j is 0
                    l = c
                if j is (_map.size.height - 1)
                    r = c

                v1[0] = _vertArray[r * 11 + 0] - _vertArray[l * 11 + 0]
                v1[1] = _vertArray[r * 11 + 1] - _vertArray[l * 11 + 1]
                v1[2] = _vertArray[r * 11 + 2] - _vertArray[l * 11 + 2]

                v2[0] = _vertArray[d * 11 + 0] - _vertArray[u * 11 + 0]
                v2[1] = _vertArray[d * 11 + 1] - _vertArray[u * 11 + 1]
                v2[2] = _vertArray[d * 11 + 2] - _vertArray[u * 11 + 2]

                // While we are in this loop, calculate the delta map for LOD
                // deltaRows[offset] = _vertArray[offset * 11 + 1] - _vertArray[(offset+1) * 11 + 1]

                // perform cross products on the two vectors
                normal[0] = v2[1]*v1[2]-v2[2]*v1[1] // Calculate the x component of the normal
                normal[1] = v2[2]*v1[0]-v2[0]*v1[2] // Calculate the y component of the normal
                normal[2] = v2[0]*v1[1]-v2[1]*v1[0] // Calculate the z component of the normal

                length = sqrt(normal[0] * normal[0] +
                              normal[1] * normal[1] +
                              normal[2] * normal[2])

                normal[0] /= length
                normal[1] /= length
                normal[2] /= length

                _vertArray[offset * 11 + 3] = (float) normal[0]
                _vertArray[offset * 11 + 4] = (float) normal[1]
                _vertArray[offset * 11 + 5] = (float) normal[2]

                // set tangent as vector1
                length = sqrt(v1[0] * v1[0] +
                              v1[1] * v1[1] +
                              v1[2] * v1[2])

                v1[0] /= length
                v1[1] /= length
                v1[2] /= length

                self._vertArray[offset * 11 + 8] = (float) v1[0]
                self._vertArray[offset * 11 + 9] = (float) v1[1]
                self._vertArray[offset * 11 + 10] = (float) v1[2]

        // set up the face array to make all of the triangles
        var l = 0

        // loop through all of the triangles in the grid
        for var i = 0 to ((int)_map.size.height - 2)
            for var j = 0 to ((int)_map.size.width - 2)
                // CCW winding order:
                //   a-c
                //   |/|   abc,cbd
                //   b-d
                _faceArray[l]   = (GLushort) (j + ( i    * ((int)_map.size.width)))
                _faceArray[l+1] = (GLushort) (j + ((i+1) * ((int)_map.size.width)))
                _faceArray[l+2] = (GLushort) (j + ( i    * ((int)_map.size.width)) + 1)
                _faceArray[l+3] = (GLushort) (j + ( i    * ((int)_map.size.width)) + 1)
                _faceArray[l+4] = (GLushort) (j + ((i+1) * ((int)_map.size.width)))
                _faceArray[l+5] = (GLushort) (j + ((i+1) * ((int)_map.size.width)) + 1)
                l += 6

        // Set a starting value for _maxDelta and _minDelta so it isn't blank
//        maxDelta = deltaRows[0]
//        minDelta = deltaRows[0]
        
        // Loop through _deltaRows to figure out what can be merged
//        for i = 0 to (((int)_map.size.width + 1) * ((int)_map.size.height + 1) - 1)
//            if deltaRows[i] > maxDelta
//                maxDelta = deltaRows[i]
//            if deltaRows[i] < minDelta
//                minDelta = deltaRows[i]

        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (((int)_map.size.width) *
                     ((int)_map.size.height) * 11 * sizeof(GLfloat)),
                     _vertArray,
                     GL_STATIC_DRAW)

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (((int)_map.size.width-1)
                     * ((int)_map.size.height-1) * 6 * sizeof(GLushort)),
                     _faceArray,
                     GL_STATIC_DRAW)

        self._updated = false

    def override render_extra (view : array of GLfloat, projection : array of
                               GLfloat, camera : soy.bodies.Camera, lights :
                               array of soy.bodies.Light)
        // Lock so body cant be changed during render
        mutex.lock()

        // modelview matrix
        model_view : array of GLfloat[16] = view

        if _updated
            _update_landscape()
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
                                    ambient.get4f())
            glDrawElements(GL_TRIANGLES, ((int)_map.size.width-1) *
                           ((int)_map.size.height-1) * 6, GL_UNSIGNED_SHORT,
                           (GLvoid*) 0)
            i++

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self._material.disable()

        // Release lock
        mutex.unlock()
