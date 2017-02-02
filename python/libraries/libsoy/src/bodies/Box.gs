/*
 *  libsoy - soy.bodies.Box
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
    soy.atoms


class soy.bodies.Box : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    _elenum : int

    construct (position : soy.atoms.Position?, size : soy.atoms.Size?,
               material : soy.materials.Material?)
        super(position, size, 0.0f)

        // Setup for first render pass
        _ebo = 0
        _updated = true

        // Set default material
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            _material = default_material

        // Use the provided material
        else
            _material = material


    def override create_geom (geom_param : Object?, geom_scalar : float)
        // Set default size
        _width = _height = _depth = 1.0f

        geom = new ode.geoms.Box(null, (Real) _width, (Real) _height,
                                 (Real) _depth)

        // set size if provided
        if geom_param is not null
            self.size = (soy.atoms.Size) geom_param
        geom.SetCategoryBits(GeomBody)
        geom.SetData((void*) self)

        body.SetData((void*) self)

        // Copy position and orientation from geom
        pos : weak ode.Vector3 = geom.GetPosition()
        body.SetPosition(pos.x, pos.y, pos.z)
        body.SetRotation(geom.GetRotation())

        self.geom.SetBody(self.body)

        // Set mass of the body
        self.set_mass (self.density)


    def override set_mass (density : float)
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetBox(density, _width, _height, _depth)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Material Property
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

    //
    // Radius Property
    _radius : GLfloat
    prop radius : float
        get
            return self._radius
        set
            mutex.lock()
            self._radius = value
            _updated = true
            mutex.unlock()

    //
    // Size Property
    _width  : GLfloat
    _height : GLfloat
    _depth  : GLfloat
    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        // Set size while locked to avoid potential rendering weirdness
        mutex.lock()
        _width = (GLfloat) size.width
        _height = (GLfloat) size.height
        _depth = (GLfloat) size.depth
        _updated = true
        mutex.unlock()

        if scene is not null
            soy.scenes._stepLock.writer_lock()
        ((geoms.Box) self.geom).SetLengths((Real) _width,
                                           (Real) _height,
                                           (Real) _depth)
        self.set_mass (self.density)

        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def _size_weak(size : Object)
        _size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) _width,
                                           (float) _height,
                                           (float) _depth)
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
    // Collision Radius Property
    prop override readonly col_radius : float
        get
            return sqrtf(_width*_width + _height*_height + _depth*_depth)/2

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override pointDepth (x : float, y : float, z : float) : float
        return (float) ((geoms.Box) self.geom).PointDepth((Real) x, (Real) y,
                                                          (Real) z)


    // TODO modify for bisection
    def override volume ( ) : float
        return (self._width * self._height * self._depth)


    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        if alpha_stage is not self._material.translucent
            return

        // Lock so body cant be changed during render
        mutex.lock()

        // get model matrix
        model : array of GLfloat = self.model_matrix()

        // modelview matrix
        model_view : array of GLfloat[16] = self.calculate_model_view(model, view)

        // Update ebo/vbo as needed
        if _updated
            _update_box()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        // Render
        var r = 0
        if _radius > 0
            r = 384

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

        var numVert = 3
        if self._material.draw_mode is GL_LINES
            numVert = 2

        i : int = 0
        while self._material.enable(i, model_view, view, projection, lights,
                                    ambient)
            glDrawElements(self._material.draw_mode, (GLsizei) numVert*_elenum,
                           GL_UNSIGNED_SHORT, (GLvoid*) 0)
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


    def _update_box()
        ////////////////////////////////////////////////////////////////////
        //
        // Box Unfolding
        //
        //                    C--------A                 +y
        //                    | +z     |                 |
        //                    | |      |                 |____+x
        //                    | |___+x |                 /
        //                    |  top   |              +z/     E-------G
        //  A--------C--------E--------G--------A            /|      /|
        //  | +y     | +y     | +y     | +y     |           C-------A |
        //  | |      | |      | |      | |      |           | |     | |
        //  | |___-x | |___-z | |___+x | |___+z |           | F-----|-H
        //  |  front |  left  |  back  |  right |           |/      |/
        //  B--------D--------F--------H--------B           D-------B
        //         .          | -z     |
        //        /|\         | |      |
        //         |          | |___+x |
        //         |          | bottom |
        //      Tangent       D--------B
        //
        // Each side needs its own vertices for correct 2d texcoords.
        //
        // Cubemaps use vertex positions, while 2d textures use specified
        // (tx, ty) values for each face, but both use the same tangent values
        // for bumpmapping. As a result the box must be laid out as above
        // with 2d texcoords starting at (0,0) at lower left for each face.
        // Ie, for face CDEF, C=(0,1), D=(0,0), E=(1,1), F=(0,1)

        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0,0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        // calculate half values since box is centered around 0, 0, 0
        width : GLfloat = _width/2
        height : GLfloat = _height/2
        depth : GLfloat = _depth/2

        var elenum = 12

        var vernum = 24

        // add elements and vertices for rounded corners and edges
        if _radius > 0
            elenum += 384
            vernum += 240

        elements : array of GLushort = new array of GLushort[elenum*3]
        position : array of GLfloat = new array of GLfloat[vernum*3]
        normal : array of GLfloat = new array of GLfloat[vernum*3]
        texcoord : array of GLfloat = new array of GLfloat[vernum*2]
        tangent : array of GLfloat = new array of GLfloat[vernum*3]

        // generate faces
        //
        // order:
        //
        // top
        // bottom
        // front
        // back
        // right
        // left
        //
        var voffset = 0
        var eoffset = 0
        _gen_face(width, height, depth, 0, 1, 0, (GLfloat) (_radius*PI/(8*width-
                  8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*depth-8*
                  _radius+2*_radius*PI))), -1, 0, 0, eoffset, voffset, 0, 2,
                  elements, position, normal, texcoord, tangent)
        voffset += 4
        eoffset += 2
        if _radius > 0
            eoffset += 64
            voffset += 40
        _gen_face(width, -height, -depth, 0, -1, 0, (GLfloat) (_radius*PI/(8*
                  width-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  depth-8*_radius+2*_radius*PI))), -1, 0, 0, eoffset, voffset, 0
                  , 2, elements, position, normal, texcoord, tangent)
        voffset += 4
        eoffset += 2
        if _radius > 0
            eoffset += 64
            voffset += 40
        _gen_face(-width, height, depth, 0, 0, 1, (GLfloat) (_radius*PI/(8*width
                  -8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*height-
                  8*_radius+2*_radius*PI))), 1, 0, 0, eoffset, voffset, 0, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += 4
        eoffset += 2
        if _radius > 0
            eoffset += 64
            voffset += 40
        _gen_face(width, height, -depth, 0, 0, -1, (GLfloat) (_radius*PI/(8*
                  width-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  height-8*_radius+2*_radius*PI))), -1, 0, 0, eoffset, voffset, 0
                  , 1, elements, position, normal, texcoord, tangent)
        voffset += 4
        eoffset += 2
        if _radius > 0
            eoffset += 64
            voffset += 40
        _gen_face(width, height, depth, 1, 0, 0, (GLfloat) (_radius*PI/(8*depth-
                  8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*height-8
                  *_radius+2*_radius*PI))), 0, 0, -1, eoffset, voffset, 2, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += 4
        eoffset += 2
        if _radius > 0
            eoffset += 64
            voffset += 40
        _gen_face(-width, height, -depth, -1, 0, 0, (GLfloat) (_radius*PI/(8*
                  depth-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  height-8*_radius+2*_radius*PI))), 0, 0, 1, eoffset, voffset, 2
                  , 1, elements, position, normal, texcoord, tangent)
        var vertices = packArrays(position, normal, texcoord, tangent)

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        if self._material.draw_mode is GL_LINES
            elements = calculateEdges(position, elements)
            elenum = elements.length/2
            glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (2 * elenum * sizeof(
                     GLushort)), elements, GL_STATIC_DRAW)
        else
            glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (3 * elenum * sizeof(
                     GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (15 * vernum * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        _elenum = elenum
        // Reset updated flag
        _updated = false


    def _gen_face(px : float, py : float, pz : float, nx : float, ny : float,
                  nz : float, tx : float, ty : float, ux : float, uy : float,
                  uz : float, eoffset : int, voffset : int, axis1 : int,
                  axis2 : int, elements : array of GLushort,
                  position : array of GLfloat, normal : array of GLfloat,
                  texcoord : array of GLfloat, tangent : array of GLfloat)
        // px,py,pz: position of upper-left vertex (unfolded)
        // nx,ny,nz: normal
        // tx,ty: texcoord of upper-left vertex (unfolded)
        // ux,uy,uz: tangent
        // axis1 : the horizontal axis (unfolded)
        // axis2 : the vertical axis (unfolded)
        // (0 = x, 1 = y, 2 = z)
        //
        // Texcoord explanation/diagram:
        //
        // s = side
        // r = radius
        //
        //
        //         (surface area)
        //  pi*r/4      s-2r      pi*r/4
        //    ________________________
        //   |  |                  |  |
        //   __________________________
        //  /\  |                  |  /\
        // /  \ |r                r| /  \
        // |___\|__________________|/___|
        //   r                        r
        // |____________________________|
        //               s

        // array for easier indexing with axis1/axis2
        pfarray : array of GLfloat = {px,py,pz}

        // the normal axis
        axis3 : int = 3-axis1-axis2

        // make tris 01 23

        elements[eoffset*3] = (GLushort) (voffset)
        elements[eoffset*3+1] = (GLushort) (voffset+2)
        elements[eoffset*3+2] = (GLushort) (voffset+3)
        elements[eoffset*3+3] = (GLushort) (voffset+3)
        elements[eoffset*3+4] = (GLushort) (voffset+1)
        elements[eoffset*3+5] = (GLushort) (voffset)

        // subtract radius from position values
        if axis1 is 0 or axis2 is 0
            px = px - (fabsf(px)/px)*_radius
        if axis1 is 1 or axis2 is 1
            py = py - (fabsf(py)/py)*_radius
        if axis1 is 2 or axis2 is 2
            pz = pz - (fabsf(pz)/pz)*_radius

        // flip position values through axes ("final locations" for vertices)
        pfarray[axis1] *= -1
        pfarray[axis2] *= -1

        for var i=0 to 1
            for var j=0 to 1
                // transition to "final location", prevent rounding errors
                if px != pfarray[0] and axis1 is 0
                    position[(voffset+i*2+j)*3] = px*(1-2*j)
                else if px != pfarray[0] and axis2 is 0
                    position[(voffset+i*2+j)*3] = px*(1-2*i)
                else
                    position[(voffset+i*2+j)*3] = px
                if py != pfarray[1] and axis1 is 1
                    position[(voffset+i*2+j)*3+1] = py*(1-2*j)
                else if py != pfarray[1] and axis2 is 1
                    position[(voffset+i*2+j)*3+1] = py*(1-2*i)
                else
                    position[(voffset+i*2+j)*3+1] = py
                if pz != pfarray[2] and axis1 is 2
                    position[(voffset+i*2+j)*3+2] = pz*(1-2*j)
                else if pz != pfarray[2] and axis2 is 2
                    position[(voffset+i*2+j)*3+2] = pz*(1-2*i)
                else
                    position[(voffset+i*2+j)*3+2] = pz
                normal[(voffset+i*2+j)*3] = nx
                normal[(voffset+i*2+j)*3+1] = ny
                normal[(voffset+i*2+j)*3+2] = nz
                texcoord[(voffset+i*2+j)*2] = (GLfloat) (tx+j*((fabsf(
                         pfarray[axis1])*4-4*_radius)/(fabsf(pfarray[axis1])*4-4
                         *_radius+PI*_radius)))
                texcoord[(voffset+i*2+j)*2+1] = (GLfloat) (-(ty-i*((fabsf
                          (pfarray[axis2])*4-4*_radius)/(fabsf(pfarray[axis2])*4-
                          4*_radius+PI*_radius))))+1.0f
                tangent[(voffset+i*2+j)*3] = ux
                tangent[(voffset+i*2+j)*3+1] = uy
                tangent[(voffset+i*2+j)*3+2] = uz

        if _radius > 0
            // TODO: subdivide fully
            // Note: All the for loops are here to make subdivision
            //       implementation easier.
            var reoffset = eoffset + 2
            var rvoffset = voffset + 4
            // edge order:
            // up
            // down
            // left
            // right

            // edge faces

            // up/down
            for var i=0 to 1 // up or down
                for var j=0 to 1 // perpendicular to flat side
                    elements[reoffset*3+j*12+i*24] = (GLushort) (rvoffset-1+j+i*
                                                                 6)
                    elements[reoffset*3+j*12+i*24+1] = (GLushort) (rvoffset+4+j+
                                                                   i*6)
                    elements[reoffset*3+j*12+i*24+2] = (GLushort) (rvoffset+j+i*
                                                                   6)

                    elements[reoffset*3+j*12+i*24+3] = (GLushort) (rvoffset+j+i*
                                                                   6)
                    elements[reoffset*3+j*12+i*24+4] = (GLushort) (rvoffset+4+j+
                                                                   i*6)
                    elements[reoffset*3+j*12+i*24+5] = (GLushort) (rvoffset+2+j+
                                                                   i*6)

                    elements[reoffset*3+j*12+i*24+6] = (GLushort) (rvoffset+2+j+
                                                                   i*6)
                    elements[reoffset*3+j*12+i*24+7] = (GLushort) (rvoffset+4+j+
                                                                   i*6)
                    elements[reoffset*3+j*12+i*24+8] = (GLushort) (rvoffset+1+j+
                                                                   i*6)

                    elements[reoffset*3+j*12+i*24+9] = (GLushort) (rvoffset+1+j+
                                                                   i*6)
                    elements[reoffset*3+j*12+i*24+10] = (GLushort) (rvoffset+4+j
                                                                    +i*6)
                    elements[reoffset*3+j*12+i*24+11] = (GLushort) (rvoffset-1+j
                                                                    +i*6)

            // left/right
            for var i=0 to 1 // left or right
                for var j=0 to 1 // perpendicular to flat side
                    elements[reoffset*3+j*12+48+i*24] = (GLushort) (rvoffset-1+j
                                                                    +i*6+12)
                    elements[reoffset*3+j*12+48+i*24+1] = (GLushort) (rvoffset+4
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+2] = (GLushort) (rvoffset+j
                                                                      +i*6+12)
                    elements[reoffset*3+j*12+48+i*24+3] = (GLushort) (rvoffset+j
                                                                      +i*6+12)
                    elements[reoffset*3+j*12+48+i*24+4] = (GLushort) (rvoffset+4
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+5] = (GLushort) (rvoffset+2
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+6] = (GLushort) (rvoffset+2
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+7] = (GLushort) (rvoffset+4
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+8] = (GLushort) (rvoffset+1
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+9] = (GLushort) (rvoffset+1
                                                                      +j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+10] = (GLushort) (rvoffset+
                                                                     4+j+i*6+12)
                    elements[reoffset*3+j*12+48+i*24+11] = (GLushort) (rvoffset-
                                                                     1+j+i*6+12)


            // connect faces to flat side

            // top
            elements[reoffset*3] = (GLushort) (voffset)
            elements[reoffset*3+8] = (GLushort) (voffset+1)
            elements[reoffset*3+9] = (GLushort) (voffset+1)
            elements[reoffset*3+11] = (GLushort) (voffset)

            // bottom
            elements[reoffset*3+24] = (GLushort) (voffset+3)
            elements[reoffset*3+32] = (GLushort) (voffset+2)
            elements[reoffset*3+33] = (GLushort) (voffset+2)
            elements[reoffset*3+35] = (GLushort) (voffset+3)

            // left
            elements[reoffset*3+48] = (GLushort) (voffset+2)
            elements[reoffset*3+56] = (GLushort) (voffset)
            elements[reoffset*3+57] = (GLushort) (voffset)
            elements[reoffset*3+59] = (GLushort) (voffset+2)

            // right
            elements[reoffset*3+72] = (GLushort) (voffset+1)
            elements[reoffset*3+80] = (GLushort) (voffset+3)
            elements[reoffset*3+81] = (GLushort) (voffset+3)
            elements[reoffset*3+83] = (GLushort) (voffset+1)

            // edge vertices

            // top/bottom
            for var k=0 to 1 // top or bottom
                for var i=0 to 1 // parallel to flat side
                    for var j=0 to 1 // perpendicular to flat side
                        position[(rvoffset+i*2+k*6+j)*3] = px
                        position[(rvoffset+i*2+k*6+j)*3+1] = py
                        position[(rvoffset+i*2+k*6+j)*3+2] = pz
                        position[(rvoffset+i*2+k*6+j)*3+axis1] *= (1-2*((float)i
                                                                   ))*(1-2*k)
                        position[(rvoffset+i*2+k*6+j)*3+axis2] += (
                                 position[(rvoffset+k*6+i*2+j)*3+
                                 axis2]/fabsf(position[(rvoffset+k*6+
                                 i*2+j)*3+axis2]))*_radius*(sinf((float)PI/(8-4*
                                 j)))
                        position[(rvoffset+i*2+k*6+j)*3+axis2] *= 1-2*k
                        position[(rvoffset+i*2+k*6+j)*3+axis3] -= (
                                 position[(rvoffset+k*6+i*2+j)*3+
                                 axis3]/fabsf(position[(rvoffset+k*6+
                                 i*2+j)*3+axis3]))*_radius*(1-cosf((float)PI/(8-
                                 4*j)))
                        normal[(rvoffset+i*2+k*6+j)*3+axis2] = sinf((
                               float)PI/(8-4*j))*(1-2*k)*(py/fabsf(py))
                        normal[(rvoffset+i*2+k*6+j)*3+axis3] = cosf((
                               float)PI/(8-4*j))*(pz/fabsf(pz))
                        texcoord[(rvoffset+i*2+k*6+j)*2] = (k+(1-2*k)
                                 *((float)i)+(1-2*k)*(1-2*((float)i))*
                                 ((float)PI*_radius/(fabsf(pfarray[axis1])*8-8*
                                 _radius+2*(float)PI*_radius)))
                        texcoord[(rvoffset+i*2+k*6+j)*2+1] = -(1-k+(1
                                 -j)*(2*k-1)*((float)PI*_radius/(fabsf(pfarray[
                                 axis2])*16-16*_radius+4*(float)PI*_radius)))+(
                                 1.0f)
                        tangent[(rvoffset+i*2+k*6+j)*3] = ux
                        tangent[(rvoffset+i*2+k*6+j)*3+1] = uy
                        tangent[(rvoffset+i*2+k*6+j)*3+2] = uz
                // centers
                for var i=0 to 1 // perpendicular to flat side
                    position[((rvoffset+k*6+4+i)*3
                             )] = (position[(rvoffset+k*6-1+i
                             )*3]+position[(rvoffset+k*6+2+i)
                             *3])/2
                    position[((rvoffset+k*6+4+i)*3+1
                             )] = (position[(rvoffset+k*6-1+i
                             )*3+1]+position[(rvoffset+k*6+2+i)*3+1])/2
                    position[((rvoffset+k*6+4+i)*3+2
                             )] = (position[(rvoffset+k*6-1+i
                             )*3+2]+position[(rvoffset+k*6+2+i)*3+2])/2
                    normal[((rvoffset+k*6+4+i)*3+
                           axis2)] = sinf((1+2*i)*(float)PI/16)*(1-2*k)*(py/
                           fabsf(py))
                    normal[((rvoffset+k*6+4+i)*3+
                           axis3)] = cosf((1+2*i)*(float)PI/16)*(pz/fabsf(pz
                           ))
                    texcoord[((rvoffset+k*6+4+i)*2
                             )] = k+(1-2*k)*(0.5f)+(1-2*k)*(
                             1-2*(0.5f))*((float)PI*_radius/
                             (fabsf(pfarray[axis1])*8-8*_radius+2*(float)PI*
                             _radius))
                    texcoord[((rvoffset+k*6+4+i)*2+1
                             )] = -(1-k+(2*k-1)*((3-2*i)*(float)PI*_radius/(
                             fabsf(pfarray[axis2])*32-32*_radius+8*(float)PI
                             *_radius)))+1.0f
                    tangent[((rvoffset+k*6+4+i)*3)] = ux
                    tangent[((rvoffset+k*6+4+i)*3+1)] = uy
                    tangent[((rvoffset+k*6+4+i)*3+2)] = uz
            position[(rvoffset+4)*3] = (position[voffset*3]
                                            +position[(rvoffset+2)*3])/2
            position[(rvoffset+4)*3+1] = (position[voffset*
                                      3+1]+position[(rvoffset+2)*3+1])/2
            position[(rvoffset+4)*3+2] = (position[(voffset)*
                                      3+2]+position[(rvoffset+2)*3+2])/2
            position[(rvoffset+1*6+4)*3] = (position
                     [(voffset+3)*3]+position[(rvoffset+1
                     *6+2)*3])/2
            position[(rvoffset+1*6+4)*3+1] = (
                     position[(voffset+3)*3+1]+position[(
                     rvoffset+1*6+2)*3+1])/2
            position[(rvoffset+1*6+4)*3+2] = (
                     position[(voffset+3)*3+2]+position[(
                     rvoffset+1*6+2)*3+2])/2

            // left/right
            for var k=0 to 1 // left or right
                for var i=0 to 1 // parallel to flat side
                    for var j=0 to 1 // perpendicular to flat side
                        position[((rvoffset+12+i*2+k*6+j)*3)] = px
                        position[((rvoffset+12+i*2+k*6+j)*3+1)] = py
                        position[((rvoffset+12+i*2+k*6+j)*3+2)] = pz
                        position[((rvoffset+12+i*2+k*6+j)*3
                                 +axis1)] += (position[(rvoffset+12+k*
                                 6+i*2+j)*3+axis1]/fabsf(position[(
                                 rvoffset+12+k*6+i*2+j)*3+
                                 axis1]))*_radius*(sinf((float)PI/(8-4*j)))
                        position[((rvoffset+12+i*2+k*6+j)*3
                                 +axis1)] *= 1-2*k
                        position[((rvoffset+12+i*2+k*6+j)*3
                                 +axis2)] *= -(1-2*((float)i))*(1-2*k)
                        position[((rvoffset+12+i*2+k*6+j)*3
                                 +axis3)] -= (position[(rvoffset+12+k*
                                 6+i*2+j)*3+axis3]/fabsf(position[(
                                 rvoffset+12+k*6+i*2+j)*3+
                                 axis3]))*_radius*(1-cosf((float)PI/(8-4*j)))
                        normal[((rvoffset+12+i*2+k*6+j)*3+
                               axis1)] = sinf((float)PI/(8-4*j))*(1-2*k)*(px/
                               fabsf(px))
                        normal[((rvoffset+12+i*2+k*6+j)*3+
                               axis3)] = cosf((float)PI/(8-4*j))*(pz/fabsf(pz))
                        texcoord[((rvoffset+12+i*2+k*6+j)*2
                                 )] = k+(1-j)*(1-2*k)*((float)PI*_radius/(fabsf(
                                 pfarray[axis1])*16-16*_radius+4*(float)PI*
                                 _radius))
                        texcoord[((rvoffset+12+i*2+k*6+j)*2
                                 +1)] = -(k+(1-2*k)*((float)i)+(1-2*k)*(1-2
                                 *((float)i))*((float)PI*_radius/(fabsf(
                                 pfarray[axis2])*8-8*_radius+2*(float)PI*_radius
                                 )))+1.0f
                        tangent[((rvoffset+12+i*2+k*6+j)*3)] = ux
                        tangent[((rvoffset+12+i*2+k*6+j)*3+1)] = uy
                        tangent[((rvoffset+12+i*2+k*6+j)*3+2)] = uz
                        tangent[(rvoffset+12+i*2+k*6+j)*3+axis1] = cosf(
                                (float)PI/(8-4*j))*tangent[(rvoffset+12+i*2+k*6
                                +j)*3+axis1]/fabsf(tangent[(rvoffset+12+i*
                                2+k*6+j)*3+axis1])
                        tangent[(rvoffset+12+i*2+k*6+j)*3+axis3] = -sinf(
                                (float)PI/(8-4*j))*normal[(rvoffset+12+i*2+k*6
                                +j)*3+axis3]/fabsf(normal[(rvoffset+12+i
                                *2+k*6+j)*3+axis3])*(1-2*k)
                // centers
                for var i=0 to 1 // perpendicular to flat side
                    position[(rvoffset+12+k*6+4
                             +i)*3] = (position[(rvoffset+12+
                             k*6-1+i)*3]+position[(rvoffset+12
                             +k*6+2+i)*3])/2
                    position[(rvoffset+12+k*6+4
                             +i)*3+1] = (position[(rvoffset+12
                             +k*6-1+i)*3+1]+position[(
                             rvoffset+12+k*6+2+i)*3
                             +1])/2
                    position[(rvoffset+12+k*6+4
                             +i)*3+2] = (position[(rvoffset+12
                             +k*6-1+i)*3+2]+position[(
                             rvoffset+12+k*6+2+i)*3
                             +2])/2
                    texcoord[(rvoffset+12+k*6+4
                             +i)*2] = k+(1-2*k)*((3-2*i)*(float)PI*
                             _radius/(fabsf(pfarray[axis1])*32-32*_radius+8*
                            (float)PI*_radius))
                    texcoord[(rvoffset+12+k*6+4
                             +i)*2+1] = -(k+(1-2*k)*(0.5f))+1.0f
                    normal[(rvoffset+12+k*6+4+
                           i)*3+axis1] = sinf((1+2*i)*(float)PI/16)*(1-2
                           *k)*(px/fabsf(px))
                    normal[(rvoffset+12+k*6+4+
                           i)*3+axis3] = cosf((1+2*i)*(float)PI/16)*(pz/
                           fabsf(pz))
                    tangent[(rvoffset+12+k*6+4
                            +i)*3] = ux
                    tangent[(rvoffset+12+k*6+4
                            +i)*3+1] = uy
                    tangent[(rvoffset+12+k*6+4
                            +i)*3+2] = uz
                    tangent[((rvoffset+12+k*6+4+i)*3+
                            axis1)] = cosf((1+2*i)*(float)PI/16)*tangent[((
                            rvoffset+12+k*6+4+i)*3+
                            axis1)]/fabsf(tangent[((rvoffset+12+k*6+
                            4+i)*3+axis1)])
                    tangent[((rvoffset+12+k*6+4+i)*3+
                            axis3)] = -sinf((1+2*i)*(float)PI/16)*normal[(
                            rvoffset+12+i*2+k*6)*3+axis3]/fabsf(
                            normal[(rvoffset+12+i*2+k*6)*3+axis3]
                            )*(1-2*k)
            // fix centers next to edge
            position[(rvoffset+12+4)*3] = (position[(
                     voffset+2)*3]+position[(rvoffset+4*(2+1)+2)*3])/2
            position[(rvoffset+12+4)*3+1] = (position
                     [(voffset+2)*3+1]+position[(rvoffset+4*
                     3+2)*3+1])/2
            position[(rvoffset+12+4)*3+2] = (position
                     [(voffset+2)*3+2]+position[(rvoffset+4*
                     3+2)*3+2])/2
            position[((rvoffset+12+6+4)*3
                     )] = (position[(voffset+1)*3]+position[(
                     rvoffset+12+6+2)*3])/2
            position[((rvoffset+12+6+4)*3+
                     1)] = (position[(voffset+1)*3+1]+position
                     [(rvoffset+12+6+2)*3+1])/2
            position[((rvoffset+12+6+4)*3+
                     2)] = (position[(voffset+1)*3+2]+position
                     [(rvoffset+12+6+2)*3+2])/2

            reoffset += 32
            rvoffset += 24

            // corner order:
            // upper-left
            // upper-right
            // lower-left
            // lower-right

            // corner faces

            // preserve vertex order by splitting up corner cases
            // upper-left, lower-right
            for var i=0 to 1
                for var j=0 to 1
                    for var k=0 to 1
                        elements[reoffset*3+k*6+j*12+i*3*24] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-3)
                        elements[reoffset*3+k*6+j*12+i*3*24+1] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-1)
                        elements[reoffset*3+k*6+j*12+i*3*24+2] = (GLushort) (
                                                           rvoffset+j*2+k+i*3*4)
                        elements[reoffset*3+k*6+j*12+i*3*24+3] = (GLushort) (
                                                           rvoffset+j*2+k+i*3*4)
                        elements[reoffset*3+k*6+j*12+i*3*24+4] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-2)
                        elements[reoffset*3+k*6+j*12+i*3*24+5] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-3)

            // upper-right, lower-left
            for var i=0 to 1
                for var j=0 to 1
                    for var k=0 to 1
                        elements[reoffset*3+k*6+j*12+(i+1)*24] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-3)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+1] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-2)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+2] = (GLushort) (
                                                         rvoffset+j*2+k+(i+1)*4)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+3] = (GLushort) (
                                                         rvoffset+j*2+k+(i+1)*4)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+4] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-1)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+5] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-3)

            // connect faces to edges
            elements[reoffset*3] = (GLushort) voffset
            elements[reoffset*3+1] = (GLushort) rvoffset-24
            elements[reoffset*3+4] = (GLushort) rvoffset-10
            elements[reoffset*3+5] = (GLushort) voffset
            elements[reoffset*3+1*6] = (GLushort) rvoffset-10
            elements[reoffset*3+1*6+4] = (GLushort) rvoffset-9
            elements[reoffset*3+1*6+5] = (GLushort) rvoffset-10
            elements[reoffset*3+2*6] = (GLushort) rvoffset-24
            elements[reoffset*3+2*6+1] = (GLushort) rvoffset-23
            elements[reoffset*3+2*6+5] = (GLushort) rvoffset-24

            elements[reoffset*3+4*6] = (GLushort) voffset+1
            elements[reoffset*3+4*6+1] = (GLushort) rvoffset-6
            elements[reoffset*3+4*6+4] = (GLushort) rvoffset-22
            elements[reoffset*3+4*6+5] = (GLushort) voffset+1
            elements[reoffset*3+5*6] = (GLushort) rvoffset-6
            elements[reoffset*3+5*6+1] = (GLushort) rvoffset-5
            elements[reoffset*3+5*6+5] = (GLushort) rvoffset-6
            elements[reoffset*3+6*6] = (GLushort) rvoffset-22
            elements[reoffset*3+6*6+4] = (GLushort) rvoffset-21
            elements[reoffset*3+6*6+5] = (GLushort) rvoffset-22

            elements[reoffset*3+8*6] = (GLushort) voffset+2
            elements[reoffset*3+8*6+1] = (GLushort) rvoffset-12
            elements[reoffset*3+8*6+4] = (GLushort) rvoffset-16
            elements[reoffset*3+8*6+5] = (GLushort) voffset+2
            elements[reoffset*3+9*6] = (GLushort) rvoffset-12
            elements[reoffset*3+9*6+1] = (GLushort) rvoffset-11
            elements[reoffset*3+9*6+5] = (GLushort) rvoffset-12
            elements[reoffset*3+10*6] = (GLushort) rvoffset-16
            elements[reoffset*3+10*6+4] = (GLushort) rvoffset-15
            elements[reoffset*3+10*6+5] = (GLushort) rvoffset-16

            elements[reoffset*3+12*6] = (GLushort) voffset+3
            elements[reoffset*3+12*6+1] = (GLushort) rvoffset-18
            elements[reoffset*3+12*6+4] = (GLushort) rvoffset-4
            elements[reoffset*3+12*6+5] = (GLushort) voffset+3
            elements[reoffset*3+13*6] = (GLushort) rvoffset-4
            elements[reoffset*3+13*6+4] = (GLushort) rvoffset-3
            elements[reoffset*3+13*6+5] = (GLushort) rvoffset-4
            elements[reoffset*3+14*6] = (GLushort) rvoffset-18
            elements[reoffset*3+14*6+1] = (GLushort) rvoffset-17
            elements[reoffset*3+14*6+5] = (GLushort) rvoffset-18

            // TODO: generate this
            var tempa = 0.3574042230063865f
            var tempb = 0.8628582981894548f
            var tempc = 0.660402692386501f
            var tempd = 0.35740252905837294f
            tempnormal : array of float = {
            -tempa,     tempa,      tempb,
            -tempc,     tempd,      tempc,
            -tempd,     tempc,      tempc,
            -sqrtf(3)/3, sqrtf(3)/3, sqrtf(3)/3}
            tempnormalindex : array of int = {
             0,  2,  1, // axes - top/bottom
             0,  1,  2, // axes - front/back
             2,  1,  0, // axes - right/left
            -1,  1,  1, // signs - top
            -1, -1, -1, // signs - bottom
             1,  1,  1, // signs - front
            -1,  1, -1, // signs - back
             1,  1, -1, // signs - right
            -1,  1,  1} // signs - left
            temporigin : array of float = {
                fabsf(px), fabsf(py), fabsf(pz)
            }
            temporigin[axis3] -= _radius

            // corner vertices
            for var i=0 to 1 // vertical flip over side
                for var j=0 to 1 // horizontal flip over side
                    for var k=0 to 1 // vertical in corner
                        for var l=0 to 1 // horizontal in corner
                            normalindex : int = (int) (2*fabsf(nz)+4*fabsf(nx)+(
                                              1-(fabsf(nx+ny+nz)/(nx+ny+nz)))/2)
                            p1 : float = ((fabsf(pfarray[axis1])/pfarray[axis1])
                                          *(j*2-1)*(l+1)*_radius/2)
                            p2 : float = ((fabsf(pfarray[axis2])/pfarray[axis2])
                                          *(i*2-1)*(k+1)*_radius/2)
                            p3 : float = ((fabsf(pfarray[axis3])/pfarray[axis3])
                                          *_radius)
                            magnitude : float = sqrtf(p1*p1 + p2*p2 + p3*p3)/_radius
                            p1 /= magnitude
                            p2 /= magnitude
                            p3 /= magnitude
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis1] = (
                                     p1 + (fabsf(p1)/p1) * temporigin[axis1])
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis2] = (
                                     p2 + (fabsf(p2)/p2) * temporigin[axis2])
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis3] = (
                                     p3 + (fabsf(p3)/p3) * temporigin[axis3])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3] = (
                                   tempnormalindex[9+normalindex*3]*tempnormal[(
                                   k*2+l)*3+tempnormalindex[3*(normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+1] = (
                                   tempnormalindex[9+normalindex*3+1]*
                                   tempnormal[(k*2+l)*3+tempnormalindex[1+3*(
                                   normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+2] = (
                                   tempnormalindex[9+normalindex*3+2]*
                                   tempnormal[(k*2+l)*3+tempnormalindex[2+3*(
                                   normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+axis1] *= (1-2*j)
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+axis2] *= (1-2*i)
                            texcoord[(rvoffset+l+k*2+j*4+i*8)*2] = texcoord[(
                                     rvoffset-(4-2*j)*3+l)*2]
                            texcoord[(rvoffset+l+k*2+j*4+i*8)*2+1] = texcoord[(
                                     rvoffset-(4-2*i)*3-12+k
                                     )*2+1]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3] = tangent[(
                                    rvoffset-24+i*6+k)*3]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+1] = tangent[(
                                    rvoffset-24+i*6+k)*3+1]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+2] = tangent[(
                                    rvoffset-24+i*6+k)*3+2]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+axis2] = fabsf(
                                    tangent[(rvoffset-24+i*2*
                                    3+k)*3+axis3])*sinf((l+1)*(float)PI
                                    /8)*(1-2*j)*(1-2*i)*fabsf(pfarray[axis2]
                                    )/pfarray[axis2]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+axis3] = (
                                    tangent[(rvoffset-24+i*2*
                                    3+k)*3+axis3]*cosf((l+1)*(float)PI/
                                    8))
