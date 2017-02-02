/*
 *  libsoy - soy.atoms.Face
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


class soy.atoms.Face : Object
    event on_set (face : Face)

    construct (a : Vertex, b : Vertex, c : Vertex)
        self._a = a
        self._b = b
        self._c = c
        _a.on_set.connect(self._vertex_set)
        _b.on_set.connect(self._vertex_set)
        _c.on_set.connect(self._vertex_set)
        self._material = new soy.materials.Material()

    construct with_material (a : Vertex, b : Vertex, c : Vertex,
                             material : soy.materials.Material)
        self._a = a
        self._b = b
        self._c = c
        _a.on_set.connect(self._vertex_set)
        _b.on_set.connect(self._vertex_set)
        _c.on_set.connect(self._vertex_set)
        self._material = material


    ////////////////////////////////////////////////////////////////////////
    // Sequence Methods

    _a : Vertex
    _b : Vertex
    _c : Vertex
    def new get (index : int) : Vertex?
        if index is 0
            return self._a
        if index is 1
            return self._b
        if index is 2
            return self._c
        return null
    
    def new set (index : int, value : Vertex)
        if index is 0
            _a.on_set.disconnect(self._vertex_set)
            self._a = value
        else if index is 1
            _b.on_set.disconnect(self._vertex_set)
            self._b = value
        else if index is 2
            _c.on_set.disconnect(self._vertex_set)
            self._c = value
        value.on_set.connect(self._vertex_set)
        self.on_set(self)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    def _vertex_set(position : soy.atoms.Vertex)
        //print("face: vertex_set")
        self.on_set(self)

    _material : soy.materials.Material
    prop material : soy.materials.Material
        get
            return self._material
        set
            self._material = value
            self.on_set(self)


    def static cmp_eq (left : Object, right : Object) : bool
        if not (left isa soy.atoms.Face) or not (right isa soy.atoms.Face)
            return false

        _a : bool = soy.atoms.Vertex.cmp_eq(((soy.atoms.Face) left).get(0),
                                            ((soy.atoms.Face) right).get(0))
        _b : bool = soy.atoms.Vertex.cmp_eq(((soy.atoms.Face) left).get(1),
                                            ((soy.atoms.Face) right).get(1))
        _c : bool = soy.atoms.Vertex.cmp_eq(((soy.atoms.Face) left).get(2),
                                            ((soy.atoms.Face) right).get(2))
        // TODO: add material check?

        return (_a & _b & _c)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
