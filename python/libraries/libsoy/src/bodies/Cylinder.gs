/*
 *  libsoy - soy.bodies.Cylinder
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


class soy.bodies.Cylinder : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    SLICES : int = 50 // number of slices
    LIMIT : int = 240 // slice limit

    construct (position : soy.atoms.Position?, radius : float,
               length : float, material : soy.materials.Material?)
        _params : soy.atoms.Size = new soy.atoms.Size(radius,length)
        super(position, _params, 0.0f)

        // Set default material
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            self.material = default_material

        // Use the provided material
        else
            self.material = material

        SLICES = (int)ceil(50*radius)
        _updated = true


    def override create_geom (geom_param : Object?, geom_scalar : float)
        _radius = ((soy.atoms.Size)geom_param).width
        _length = ((soy.atoms.Size)geom_param).height
        geom = new ode.geoms.Cylinder(null, (Real) _radius, (Real) _length)
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
            mass.SetCylinder(density, 2, _radius, _length)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Material property
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
    _radius  : GLfloat
    prop radius : float
        get
            return self._radius
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._radius = value
            ((geoms.Cylinder) self.geom).SetParams((Real) value, (Real) _length)
            if scene is not null
                soy.scenes._stepLock.writer_unlock()
            self.set_mass (self.density)
            SLICES = (int)ceil(50*value)
            _updated = true

    //
    // Length Property
    _length  : GLfloat
    prop length : float
        get
            return self._length
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._length = value
            ((geoms.Cylinder) self.geom).SetParams((Real) _radius, (Real) value)
            if scene is not null
                soy.scenes._stepLock.writer_unlock()
            self.set_mass (self.density)
            _updated = true

    //
    // Collision Radius Property
    prop override readonly col_radius : float
        get
            return sqrtf(_length*_length/4 + _radius*_radius)

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override volume() : float
        return (float) (3.1416 * Math.pow(self._radius, 2) * self._length)


    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        if alpha_stage is not self._material.translucent
            return

        if _radius <= 0 or _length <= 0
            return

        // Lock against changes during render
        mutex.lock()

        // get model matrix
        model : array of GLfloat = self.model_matrix()

        model_view : array of GLfloat = self.calculate_model_view(model, view)

        // Update ebo/vbo as needed
        if _updated
            _update_cylinder()
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

        i : int = 0
        while self._material.enable(i, model_view, view, projection, lights,
                                    ambient)
            glDrawElements(GL_TRIANGLES, (GLsizei) (3*(4*SLICES)),
                           GL_UNSIGNED_SHORT, (GLvoid*) 0)
            i++

        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self._material.disable()

        // Render axis
        // renderAxis()

        // Release lock
        mutex.unlock()

    def _update_cylinder()
        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0, 0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        var radius = _radius
        var length = _length/2

        elements : array of GLushort = new array of GLushort[(4*SLICES)*3]
        vertices : array of GLfloat = new array of GLfloat[(4*SLICES+4)*11]

        // Top cap

        // top vertex
        vertices[0] = 0.0f
        vertices[1] = 0.0f
        vertices[2] = length
        vertices[3] = 0.0f
        vertices[4] = 0.0f
        vertices[5] = 1.0f
        vertices[6] = 0.5f
        vertices[7] = 1/6.0f
        vertices[8] = 1.0f
        vertices[9] = 0.0f
        vertices[10] = 0.0f
        // generate cap
        for var i=0 to (SLICES-1)
            vertices[(i+1)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(i+1)*11+1] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(i+1)*11+2] = length
            vertices[(i+1)*11+3] = 0.0f
            vertices[(i+1)*11+4] = 0.0f
            vertices[(i+1)*11+5] = 1.0f
            vertices[(i+1)*11+6] = 0.5f + 1/6.0f * sinf(2*i*(float)PI/SLICES)
            vertices[(i+1)*11+7] = 1/6.0f - 1/6.0f * cosf(2*i*(float)PI/SLICES)
            vertices[(i+1)*11+8] = 1.0f
            vertices[(i+1)*11+9] = 0.0f
            vertices[(i+1)*11+10] = 0.0f
            elements[i*3] = 0
            elements[i*3+1] = i+2
            elements[i*3+2] = i+1

        // make cap loop around
        elements[(SLICES-1)*3+1] = 1

        // Bottom cap

        // bottom vertex
        vertices[(4*SLICES+3)*11] = 0.0f
        vertices[(4*SLICES+3)*11+1] = 0.0f
        vertices[(4*SLICES+3)*11+2] = -length
        vertices[(4*SLICES+3)*11+3] = 0.0f
        vertices[(4*SLICES+3)*11+4] = 0.0f
        vertices[(4*SLICES+3)*11+5] = -1.0f
        vertices[(4*SLICES+3)*11+6] = 0.5f
        vertices[(4*SLICES+3)*11+7] = 5/6.0f
        vertices[(4*SLICES+3)*11+8] = 1.0f
        vertices[(4*SLICES+3)*11+9] = 0.0f
        vertices[(4*SLICES+3)*11+10] = 0.0f

        // generate cap
        for var i=0 to (SLICES-1)
            vertices[(3*SLICES+i+3)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+1] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+2] = -length
            vertices[(3*SLICES+i+3)*11+3] = 0.0f
            vertices[(3*SLICES+i+3)*11+4] = 0.0f
            vertices[(3*SLICES+i+3)*11+5] = -1.0f
            vertices[(3*SLICES+i+3)*11+6] = 0.5f + 1/6.0f * sinf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+7] = 5/6.0f + 1/6.0f * cosf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+8] = 1.0f
            vertices[(3*SLICES+i+3)*11+9] = 0.0f
            vertices[(3*SLICES+i+3)*11+10] = 0.0f
            elements[(3*SLICES+i)*3] = 4*SLICES+3
            elements[(3*SLICES+i)*3+1] = 3*SLICES+i+3
            elements[(3*SLICES+i)*3+2] = 3*SLICES+i+4

        // make cap loop around
        elements[(4*SLICES-1)*3+2] = 3*SLICES+3

        // Side

        //
        //  1---3---5- ...
        //  |\  |\  |\
        //  | \ | \ |  ...
        //  |  \|  \| 
        //  2---4---6- ...
        //

        for var i=0 to SLICES
            vertices[(SLICES+i*2+1)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+1] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+2] = length
            vertices[(SLICES+i*2+1)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+4] = cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+5] = 0.0f
            vertices[(SLICES+i*2+1)*11+6] = 1-i/(float)(SLICES)
            vertices[(SLICES+i*2+1)*11+7] = 1/3.0f
            vertices[(SLICES+i*2+1)*11+8] = -vertices[(SLICES+i*2+1)*11+4]
            vertices[(SLICES+i*2+1)*11+9] = vertices[(SLICES+i*2+1)*11+3]
            vertices[(SLICES+i*2+1)*11+10] = 1.0f
            vertices[(SLICES+i*2+2)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+1] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+2] = -length
            vertices[(SLICES+i*2+2)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+4] = cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+5] = 0.0f
            vertices[(SLICES+i*2+2)*11+6] = 1-i/(float)(SLICES)
            vertices[(SLICES+i*2+2)*11+7] = 2/3.0f
            vertices[(SLICES+i*2+2)*11+8] = -vertices[(SLICES+i*2+2)*11+4]
            vertices[(SLICES+i*2+2)*11+9] = vertices[(SLICES+i*2+2)*11+3]
            vertices[(SLICES+i*2+2)*11+10] = 1.0f

        for var i=0 to (SLICES-1)
            elements[(SLICES+i*2)*3] = (GLushort)SLICES+i*2+1
            elements[(SLICES+i*2)*3+1] = (GLushort)SLICES+i*2+4
            elements[(SLICES+i*2)*3+2] = (GLushort)SLICES+i*2+2
            elements[(SLICES+i*2)*3+3] = (GLushort)SLICES+i*2+4
            elements[(SLICES+i*2)*3+4] = (GLushort)SLICES+i*2+1
            elements[(SLICES+i*2)*3+5] = (GLushort)SLICES+i*2+3

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                     (GLsizei) (3 * 4 * SLICES * sizeof(GLushort)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER,
                     (GLsizei) (11 * (4*SLICES+4) * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

