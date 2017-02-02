/*
 *  libsoy - soy.bodies.Mesh
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
 */

[indent=4]
uses
    GL
    ode
    soy

class soy.bodies.Mesh : soy.bodies.Body
    _materials : list of soy.materials.Material
    _matgroups : list of Gee.ArrayList of int
    _mat_index : list of int
    _face_objs : dict of int, weak soy.atoms.Face?
    _vert_objs : dict of int, weak soy.atoms.Vertex?

    _verts : GLfloat*                   // px py pz nx ny nz tx ty ux uy uz

    _ebo : GLuint                       // Element Buffer Object ID
    _vbo : GLuint                       // Vertex Buffer Object ID
    _updated : bool                     // Buffers need updating

    ////////////////////////////////////////////////////////////////////////
    // Properties

    // the number of faces the mesh can contain
    _length : int
    prop length : int
        get
            return self._length
        set
            self._resize(value)

    init
        // _materials and _matgroups store the materials used by faces within
        // the Mesh and how many faces use each material so the render function
        // knows how many faces to render before switching to the next Material
        //
        // We do not use a list of a struct for this because Genie has poor
        // support for using a struct with generics currently.  In the future
        // this could be cleaned up somewhat, but is fine for now.
        //
        // These lists should always be the same size.
        _materials = new list of soy.materials.Material
        _matgroups = new list of Gee.ArrayList of int
        _mat_index = new list of int

        // _face_objs holds a weak reference for every Face object we have
        // created, mapped by its index offset, such that if the user requests
        // the same index twice we will return the same object they already have
        // instead of creating a new one.
        _face_objs = new dict of int, unowned soy.atoms.Face?
        _vert_objs = new dict of int, unowned soy.atoms.Vertex?

        // Set EBO (Element Buffer Object) and VBO (Vertex Buffer Object) to
        // zero so the render thread knows both are uninitialized.
        // These will be initialized the first time they are needed.
        _ebo = 0
        _vbo = 0
        _updated = true


    construct (position : soy.atoms.Position?)
        super(position, null, 0.0f)


    final
        // free the _verts buffer
        self._resize(0)

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
    */

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def new get (index : int) : soy.atoms.Face?
        /*for var i = 0 to (_length*33-1)
            print("_verts %i: %f",i,_verts[i])
        for var i = 0 to (_matgroups.size-1)
            for var j = 0 to (_matgroups[i].size-1)
                print("_matgroups %i: %i",i,_matgroups[i][j])
        for var i = 0 to (_mat_index.size-1)
            print("_mat_index %i: %i",i,_mat_index[i])*/
        ret : soy.atoms.Face? = null

        // check that index is in bounds
        if index < 0 or index >= self.length
            return null

        if self._face_objs.has_key(index)
            //print("found")
            //print("%i - %p",index,self._face_objs[index])
            ret = self._face_objs[index]

        else
            verts : list of soy.atoms.Vertex = new list of soy.atoms.Vertex
            v : soy.atoms.Vertex
            // each vertex occupies 11 indices and there are three vertices
            // per face
            var vert_index = index * 3
            var offset = index * 33
            for var i = 0 to 2
                if self._vert_objs.has_key(vert_index)
                    v = self._vert_objs[vert_index]

                else
                    pos : soy.atoms.Position
                    norm : soy.atoms.Vector
                    tex : soy.atoms.Position
                    tan : soy.atoms.Vector
                    pos = new soy.atoms.Position(
                        (float) self._verts[offset],
                        (float) self._verts[offset+1],
                        (float) self._verts[offset+2]
                    )
                    norm = new soy.atoms.Vector(
                        (float) self._verts[offset+3],
                        (float) self._verts[offset+4],
                        (float) self._verts[offset+5]
                    )
                    tex = new soy.atoms.Position(
                        (float) self._verts[offset+6],
                        (float) self._verts[offset+7]
                    )
                    tan = new soy.atoms.Vector(
                        (float) self._verts[offset+8],
                        (float) self._verts[offset+9],
                        (float) self._verts[offset+10]
                    )
                    v = new soy.atoms.Vertex(pos,norm,tex,tan)
                v.weak_ref(self._vert_weak)
                self._vert_objs[vert_index] = v

                verts.add(v)
                offset += 11
                vert_index += 1
            ret = new soy.atoms.Face(verts[0],verts[1],verts[2])
            ret.material = _materials[_mat_index[index]]

        ret.on_set.connect(self._face_set)
        ret.weak_ref(self._face_weak)

        self._face_objs[index] = ret
        return (owned) ret

    def new set (index : int, value : Object)
        face : soy.atoms.Face

        if not (value isa soy.atoms.Face)
            return

        face = (soy.atoms.Face) value

        if self._face_objs.has_key(index)
            var old = self._face_objs[index]
            // remove face from the weak reference list
            // (verts handled in _update_verts)
            old.on_set.disconnect(self._face_set)
            old.weak_unref(self._face_weak)

        self._face_objs[index] = face

        mutex.lock()
        var i = self._materials.index_of(face.material)
        if i is -1
            //print("mat: %p",face.material)
            self._materials.add(face.material)
            self._mat_index[index] = _materials.size-1
            self._matgroups.add(new list of int)
            self._matgroups[_materials.size-1].add(index)
        else
            self._mat_index[index] = i
            self._matgroups[i].add(index)
        self._update_verts(index, face)
        mutex.unlock()

        face.on_set.connect(self._face_set)
        face.weak_ref(self._face_weak)

    def _face_weak(face : Object)
        var garbage = new list of int
        for index in self._face_objs.keys
            if self._face_objs[index] is face
                // add the face to be garbage collected
                garbage.add(index)
        for index in garbage
            self._face_objs.unset(index)

    def _vert_weak(vert: Object)
        var garbage = new list of int
        for index in self._vert_objs.keys
            if self._vert_objs[index] is vert
                // add the face to be garbage collected
                garbage.add(index)
        for index in garbage
            self._vert_objs.unset(index)

    def _update_verts(index : int, face : soy.atoms.Face)
        // each vertex occupies 11 indices and there are 3 vertices per face
        var vert_index = index * 3
        var offset = index*33
        for var i = 0 to 2
            // save the weak reference to vert_objs
            if self._vert_objs.has_key(vert_index)
                // dereference what is already there
                self._vert_objs[vert_index].weak_unref(self._vert_weak)
            self._vert_objs[vert_index] = face.get(i)
            //print("%i - %p",vert_index,self._vert_objs[vert_index])
            self._vert_objs[vert_index].weak_ref(self._vert_weak)
            self._verts[offset]   = (GLfloat) face.get(i).position.x
            self._verts[offset+1] = (GLfloat) face.get(i).position.y
            self._verts[offset+2] = (GLfloat) face.get(i).position.z
            self._verts[offset+3] = (GLfloat) face.get(i).normal.x
            self._verts[offset+4] = (GLfloat) face.get(i).normal.y
            self._verts[offset+5] = (GLfloat) face.get(i).normal.z
            self._verts[offset+6] = (GLfloat) face.get(i).texcoord.x
            self._verts[offset+7] = (GLfloat) face.get(i).texcoord.y
            self._verts[offset+8] = (GLfloat) face.get(i).tangent.x
            self._verts[offset+9]= (GLfloat) face.get(i).tangent.y
            self._verts[offset+10]= (GLfloat) face.get(i).tangent.z
            offset += 11
            vert_index += 1

        _updated = true

    def _face_set(face : soy.atoms.Face)
        //print("mesh: face_set")
        for index in self._face_objs.keys
            if self._face_objs[index] is face
                mutex.lock()
                var mi = self._materials.index_of(face.material)
                var old = self._mat_index[index]
                if mi is -1
                    self._materials.add(face.material)
                    self._mat_index[index] = _materials.size-1
                    self._matgroups.add(new list of int)
                    self._matgroups[_materials.size-1].add(index)
                    self._matgroups[old].remove(index)
                else if mi is not old
                    self._mat_index[index] = mi
                    self._matgroups[mi].add(index)
                    self._matgroups[old].remove(index)
                if self._matgroups[old].size is 0
                    self._materials.remove_at(old)
                    self._matgroups.remove_at(old)
                    for var i = 0 to (self._mat_index.size-1)
                        if self._mat_index[i] > old
                            self._mat_index[i] = self._mat_index[i] - 1
                self._update_verts(index, face)
                mutex.unlock()

    def get_raw_verts() : GLfloat*
        return self._verts

    def set_raw_verts(verts : GLfloat*)
        if self.length is not 0
            for var i = 0 to (self.length * 33 - 1)
                self._verts[i] = verts[i]

    def clone() : Mesh
        // clone spins off a new mesh identical to the current one (used when 
        // creating mesh morphs)
        // because Mesh does not worry about the VBO or materials lists 
        // unless/until render() is called, this will be relatively cheap
        //mesh : Mesh = new Mesh(self.scene)
        mesh : Mesh = new Mesh(position)
        //TODO we need on_set events that will update length for the clone 
        // whenever it is updated in self
        // also, when new faces are added (but NOT when existing faces are 
        // updated) the face should be added to the clone also
        mesh.length = self.length
        mesh._materials = self._materials
        mesh._matgroups = self._matgroups
        mesh._mat_index = self._mat_index
        mesh.set_raw_verts(self.get_raw_verts())
        return mesh

    def morph(variant : soy.bodies.Mesh, delta : float) : soy.atoms.Morph
        // morph spins off a morph atom, which can be added to the list of 
        // morphs to be applied to a Target
        return new soy.atoms.Morph.with_delta(self,variant,delta)

    def _resize(length : int)
        buffer_size : ulong

        mutex.lock()

        // 11 indices per vertex and 3 vertices per face = 33 indices per face
        buffer_size = length * 33 * sizeof(GLfloat)

        if buffer_size is 0
            if self._length is not 0
                free(self._verts)
                self._verts = null
        else
            if self._length is not 0
                if self._length is not length
                    self._verts = (GLfloat*) realloc(self._verts,buffer_size)
            else
                // allocate a buffer to contain vertex data
                self._verts = (GLfloat*) malloc0(buffer_size)

        for var i = _mat_index.size to (length-1)
            _mat_index.add(0)

        self._length = (GLsizei) length
        mutex.unlock()

    def del(index : int)
        //print("del %i",index)
        if self._face_objs.has_key(index)
            var old = self._face_objs[index]
            // remove face and its verts from the weak reference list
            old[0].weak_unref(self._vert_weak)
            old[1].weak_unref(self._vert_weak)
            old[2].weak_unref(self._vert_weak)
            old.on_set.disconnect(self._face_set)
            old.weak_unref(self._face_weak)

        mutex.lock()
        var mi = self._mat_index[index]
        self._matgroups[mi].remove(index)
        if self._matgroups[mi].size is 0
            self._materials.remove_at(mi)
            self._matgroups.remove_at(mi)
            for var i = 0 to (self._mat_index.size-1)
                if self._mat_index[i] > mi
                    self._mat_index[i] = self._mat_index[i] - 1
        self._mat_index.remove_at(index)
        for var i = index*33 to ((_length-1)*33-1)
            self._verts[i] = self._verts[i+33]
        for var i = index to (_length-2)
            if self._face_objs.has_key(i+1)
                self._face_objs[i] = self._face_objs[i+1]
                self._face_objs.unset(i+1)
        mutex.unlock()

        self._resize(_length-1)

    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        if not alpha_stage
            return

        // Lock against changes during render
        mutex.lock()

        // get model matrix
        model : array of GLfloat = self.model_matrix()

        model_view : array of GLfloat = self.calculate_model_view(model, view)

        // Update ebo/vbo as needed
        if _updated
            _update_mesh()
        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE,
                              (GLsizei) (sizeof(GLfloat) * 11),
                              null)
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE,
                              (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 3))
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE,
                              (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 6))
        glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE,
                              (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 8))

        glEnableVertexAttribArray(0)
        glEnableVertexAttribArray(1)
        glEnableVertexAttribArray(2)
        glEnableVertexAttribArray(3)

        var offset = 0
        for var i = 0 to (self._materials.size-1)
            j : int = 0
            while self._materials[i].enable(j, model_view, view, projection,
                                            lights, ambient)
                glDrawElements(GL_TRIANGLES, (GLsizei) (3*_matgroups[i].size),
                               GL_UNSIGNED_SHORT, (GLvoid*) (offset*
                               sizeof(GLushort)))
                j++
            offset += 3*_matgroups[i].size
            self._materials[i].disable()

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        // Render axis
        // renderAxis()

        // Release lock
        mutex.unlock()

    def _update_mesh()
        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0, 0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        elements : array of GLushort = new array of GLushort[_length*3]
        vertices : array of GLfloat = new array of GLfloat[_length*33]

        for var i = 0 to (_length*3-1)
            elements[i] = i

        var index = 0
        for i in _matgroups
            for j in i
                for var k = 0 to 32
                    vertices[index+k] = _verts[j*33+k]
                index += 33

        /*for var i = 0 to (_length*33-1)
            print("%i - %f",i,vertices[i])*/

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                     (GLsizei) (_length * 3 * sizeof(GLushort)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER,
                     (GLsizei) (_length * 33 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false
