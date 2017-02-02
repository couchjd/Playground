/*
 *  libsoy - soy.joints.Slider
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
    ode
    GL
    soy.atoms
    GLib.Math

class soy.joints.Slider: soy.joints.Joint
    _ebo : GLuint // element buffer object
    _eboB : GLuint
    _vbo : GLuint // vertex buffer object
    _vboB : GLuint
    _updated : bool
    _jointRotTheta : array of GLfloat
    _jointRotPhi : array of GLfloat
    _inverseRotation : array of GLfloat
    _jointRotThetaB : array of GLfloat
    _jointRotPhiB : array of GLfloat
    _inverseRotationB : array of GLfloat

    SLICES : int = 50

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              axis: soy.atoms.Axis, material : soy.materials.Material?)
        super(bodyA, bodyB, null, axis, axis, material)
        _updated = true


    def override gen_matrices ( )
        posBRel : soy.atoms.Vector = bodyA.getRelPointPos(bodyB)
        radius : ode.Real = (ode.Real) sqrt(posBRel.x*posBRel.x +
                                            posBRel.y*posBRel.y +
                                            posBRel.z*posBRel.z)

        phi   : ode.Real = (ode.Real) acos(posBRel.y / radius)
        theta : ode.Real = (ode.Real) (atan2(posBRel.z, posBRel.x))

        _jointRotTheta = new array of GLfloat[16]
        _jointRotPhi = new array of GLfloat[16]
        _inverseRotation = new array of GLfloat[16]
        _jointRotThetaB = new array of GLfloat[16]
        _jointRotPhiB   = new array of GLfloat[16]
        _inverseRotationB  = new array of GLfloat[16]


        _jointRotPhi[0]  = (GLfloat) cos(phi)
        _jointRotPhi[1]  = (GLfloat) (-sin(phi))
        _jointRotPhi[2]  = (GLfloat) 0.0
        _jointRotPhi[3]  = (GLfloat) 0.0
        _jointRotPhi[4]  = (GLfloat) sin(phi)
        _jointRotPhi[5]  = (GLfloat) cos(phi)
        _jointRotPhi[6]  = (GLfloat) 0.0
        _jointRotPhi[7]  = (GLfloat) 0.0
        _jointRotPhi[8]  = (GLfloat) 0.0
        _jointRotPhi[9]  = (GLfloat) 0.0
        _jointRotPhi[10] = (GLfloat) 1.0
        _jointRotPhi[11] = (GLfloat) 0.0
        _jointRotPhi[12] = (GLfloat) 0.0
        _jointRotPhi[13] = (GLfloat) 0.0
        _jointRotPhi[14] = (GLfloat) 0.0
        _jointRotPhi[15] = (GLfloat) 1.0

        _jointRotTheta[0]  = (GLfloat) cos(theta)
        _jointRotTheta[1]  = (GLfloat) 0.0
        _jointRotTheta[2]  = (GLfloat) sin(theta)
        _jointRotTheta[3]  = (GLfloat) 0.0
        _jointRotTheta[4]  = (GLfloat) 0.0
        _jointRotTheta[5]  = (GLfloat) 1.0
        _jointRotTheta[6]  = (GLfloat) 0.0
        _jointRotTheta[7]  = (GLfloat) 0.0
        _jointRotTheta[8]  = (GLfloat) (-sin(theta))
        _jointRotTheta[9]  = (GLfloat) 0.0
        _jointRotTheta[10] = (GLfloat) cos(theta)
        _jointRotTheta[11] = (GLfloat) 0.0
        _jointRotTheta[12] = (GLfloat) 0.0
        _jointRotTheta[13] = (GLfloat) 0.0
        _jointRotTheta[14] = (GLfloat) 0.0
        _jointRotTheta[15] = (GLfloat) 1.0

        rotation : unowned ode.Matrix3 = bodyA.body.GetRotation()
        _inverseRotation[0] = (GLfloat) rotation.m0
        _inverseRotation[1] = (GLfloat) rotation.m1
        _inverseRotation[2] = (GLfloat) rotation.m2
        _inverseRotation[3] = (GLfloat) 0.0
        _inverseRotation[4] = (GLfloat) rotation.m4
        _inverseRotation[5] = (GLfloat) rotation.m5
        _inverseRotation[6] = (GLfloat) rotation.m6
        _inverseRotation[7] = (GLfloat) 0.0
        _inverseRotation[8] = (GLfloat) rotation.m8
        _inverseRotation[9] = (GLfloat) rotation.m9
        _inverseRotation[10] = (GLfloat) rotation.ma
        _inverseRotation[11] = (GLfloat) 0.0
        _inverseRotation[12] = (GLfloat) 0.0
        _inverseRotation[13] = (GLfloat) 0.0
        _inverseRotation[14] = (GLfloat) 0.0
        _inverseRotation[15] = (GLfloat) 1.0


        if bodyB is not null
            radiusB : ode.Real = (ode.Real) sqrt(posBRel.x*posBRel.x +
                                                posBRel.y*posBRel.y +
                                                posBRel.z*posBRel.z)

            phiB   : ode.Real = (ode.Real) acos(posBRel.y / radiusB)
            thetaB : ode.Real = (ode.Real) (atan2(posBRel.z, posBRel.x))

            _jointRotPhiB[0]  = (GLfloat) cos(phiB)
            _jointRotPhiB[1]  = (GLfloat) (-sin(phiB))
            _jointRotPhiB[2]  = (GLfloat) 0.0
            _jointRotPhiB[3]  = (GLfloat) 0.0
            _jointRotPhiB[4]  = (GLfloat) sin(phiB)
            _jointRotPhiB[5]  = (GLfloat) cos(phiB)
            _jointRotPhiB[6]  = (GLfloat) 0.0
            _jointRotPhiB[7]  = (GLfloat) 0.0
            _jointRotPhiB[8]  = (GLfloat) 0.0
            _jointRotPhiB[9]  = (GLfloat) 0.0
            _jointRotPhiB[10] = (GLfloat) 1.0
            _jointRotPhiB[11] = (GLfloat) 0.0
            _jointRotPhiB[12] = (GLfloat) 0.0
            _jointRotPhiB[13] = (GLfloat) 0.0
            _jointRotPhiB[14] = (GLfloat) 0.0
            _jointRotPhiB[15] = (GLfloat) 1.0

            _jointRotThetaB[0]  = (GLfloat) cos(thetaB)
            _jointRotThetaB[1]  = (GLfloat) 0.0
            _jointRotThetaB[2]  = (GLfloat) sin(thetaB)
            _jointRotThetaB[3]  = (GLfloat) 0.0
            _jointRotThetaB[4]  = (GLfloat) 0.0
            _jointRotThetaB[5]  = (GLfloat) 1.0
            _jointRotThetaB[6]  = (GLfloat) 0.0
            _jointRotThetaB[7]  = (GLfloat) 0.0
            _jointRotThetaB[8]  = (GLfloat) (-sin(thetaB))
            _jointRotThetaB[9]  = (GLfloat) 0.0
            _jointRotThetaB[10] = (GLfloat) cos(thetaB)
            _jointRotThetaB[11] = (GLfloat) 0.0
            _jointRotThetaB[12] = (GLfloat) 0.0
            _jointRotThetaB[13] = (GLfloat) 0.0
            _jointRotThetaB[14] = (GLfloat) 0.0
            _jointRotThetaB[15] = (GLfloat) 1.0

            rotationB : unowned ode.Matrix3 = bodyB.body.GetRotation()
            _inverseRotationB[0] = (GLfloat) rotationB.m0
            _inverseRotationB[1] = (GLfloat) rotationB.m1
            _inverseRotationB[2] = (GLfloat) rotationB.m2
            _inverseRotationB[3] = (GLfloat) 0.0
            _inverseRotationB[4] = (GLfloat) rotationB.m4
            _inverseRotationB[5] = (GLfloat) rotationB.m5
            _inverseRotationB[6] = (GLfloat) rotationB.m6
            _inverseRotationB[7] = (GLfloat) 0.0
            _inverseRotationB[8] = (GLfloat) rotationB.m8
            _inverseRotationB[9] = (GLfloat) rotationB.m9
            _inverseRotationB[10] = (GLfloat) rotationB.ma
            _inverseRotationB[11] = (GLfloat) 0.0
            _inverseRotationB[12] = (GLfloat) 0.0
            _inverseRotationB[13] = (GLfloat) 0.0
            _inverseRotationB[14] = (GLfloat) 0.0
            _inverseRotationB[15] = (GLfloat) 1.0

    def override create ( )
        joint = new ode.joints.Slider(soy.scenes._world, null)


    def override setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                        axis2 : soy.atoms.Axis?)
        ((ode.joints.Slider) joint).SetAxis((ode.Real) axis1.x,
                                            (ode.Real) axis1.y,
                                            (ode.Real) axis1.z)


    def override model_matrix_A ( ) : array of GLfloat
        var _mtx = super.model_matrix_A()
        _mtx = mult_matrix(_inverseRotation, _mtx)
        _mtx = mult_matrix(_jointRotTheta, _mtx)
        _mtx = mult_matrix(_jointRotPhi, _mtx)
        return _mtx

    def override model_matrix_B( ) : array of GLfloat
        var _mtx = super.model_matrix_B()
        _mtx = mult_matrix(_inverseRotationB, _mtx)
        _mtx = mult_matrix(_jointRotThetaB, _mtx)
        _mtx = mult_matrix(_jointRotPhiB, _mtx)
        return _mtx

    def override render ( alpha_stage : bool, view : array of GLfloat,
                          projection : array of GLfloat, lights : array of
                          soy.bodies.Light, ambient : array of GLfloat )
        // Do not render when material is not set
        if self.material is null
            return

        // lock so cant be changed during a render
        mutex.lock()

        // get model matrix
        model : array of GLfloat = self.model_matrix_A()

        // modelview matrix
        model_view : array of GLfloat[16] = self.mult_matrix(model, view)

        // update ebo/vbo if its needed
        if _updated
            _update_slider()

        // rebind buffers when not updating
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

        while self.material.enable(i, model_view, view, projection, lights,
                                    ambient)
            glDrawElements(GL_TRIANGLES, (GLsizei) (3*(4*SLICES)),
                           GL_UNSIGNED_SHORT, (GLvoid*) 0)
            i++


        glDisableVertexAttribArray(0)
        glDisableVertexAttribArray(1)
        glDisableVertexAttribArray(2)
        glDisableVertexAttribArray(3)

        self.material.disable()

        if bodyB is not null
            // get model matrix
            model_B : array of GLfloat = self.model_matrix_B()

            // modelview matrix
            model_view_B : array of GLfloat[16] = self.mult_matrix(model_B, view)

            // update ebo/vbo if its needed
            if _updated
                _update_slider_B()

            // rebind buffers when not updating
            else
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboB)
                glBindBuffer(GL_ARRAY_BUFFER, _vboB)

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

            i = 0
            while self.material.enable(i, model_view_B, view, projection, lights,
                                       ambient)
                glDrawElements(GL_TRIANGLES, (GLsizei) (3*(4*SLICES)),
                               GL_UNSIGNED_SHORT, (GLvoid*) 0)
                i++

            glDisableVertexAttribArray(0)
            glDisableVertexAttribArray(1)
            glDisableVertexAttribArray(2)
            glDisableVertexAttribArray(3)

        self.material.disable()

        // unlock mutex for writing, rendering done
        mutex.unlock()

    def _update_slider()
        // on first pass
        if _ebo == 0
            buffers : array of GLuint = {0, 0}
            glGenBuffers(buffers)
            _ebo = buffers[0]
            _vbo = buffers[1]

        posA : soy.atoms.Position = bodyA.position
        posB : soy.atoms.Position = bodyB.position

        // constants to help drawing
        radius : GLfloat = 0.25f // radius of first cylinder

        // distance in y-axis is yl
        yl : GLfloat = sqrtf((posB.x - posA.x) * (posB.x - posA.x) +
                             (posB.y - posA.y) * (posB.y - posA.y) +
                             (posB.z - posA.z) * (posB.z - posA.z))

        elements : array of GLushort = new array of GLushort[(4*SLICES)*3]
        vertices : array of GLfloat = new array of GLfloat[(4*SLICES+4)*11]

        // cap vertex
        vertices[(4*SLICES+3)*11] = 0.0f
        vertices[(4*SLICES+3)*11+1] = yl/2
        vertices[(4*SLICES+3)*11+2] = 0.0f
        vertices[(4*SLICES+3)*11+3] = 0.0f
        vertices[(4*SLICES+3)*11+4] = 1.0f
        vertices[(4*SLICES+3)*11+5] = 0.0f
        vertices[(4*SLICES+3)*11+6] = 0.5f
        vertices[(4*SLICES+3)*11+7] = 1/6.0f
        vertices[(4*SLICES+3)*11+8] = 1.0f
        vertices[(4*SLICES+3)*11+9] = 0.0f
        vertices[(4*SLICES+3)*11+10] = 0.0f

        // generate cap
        for var i=0 to (SLICES-1)
            vertices[(3*SLICES+i+3)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+1] = yl/2
            vertices[(3*SLICES+i+3)*11+2] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+3] = 0.0f
            vertices[(3*SLICES+i+3)*11+4] = 1.0f
            vertices[(3*SLICES+i+3)*11+5] = 0.0f
            vertices[(3*SLICES+i+3)*11+6] = 0.5f + 1/6.0f * sinf(2*i*(float)PI/SLICES)
            vertices[(3*SLICES+i+3)*11+7] = 1/6.0f - 1/6.0f * cosf(2*i*(float)PI/SLICES)
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
            vertices[(SLICES+i*2+1)*11+1] = 0.0f
            vertices[(SLICES+i*2+1)*11+2] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+4] = 0.0f
            vertices[(SLICES+i*2+1)*11+5] = cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+6] = 1-i/(float)(SLICES)
            vertices[(SLICES+i*2+1)*11+7] = 0.0f
            vertices[(SLICES+i*2+1)*11+8] = 0.0f
            vertices[(SLICES+i*2+1)*11+9] = 1.0f
            vertices[(SLICES+i*2+1)*11+10] = 0.0f
            vertices[(SLICES+i*2+2)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+1] = yl/2
            vertices[(SLICES+i*2+2)*11+2] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+4] = 0.0f
            vertices[(SLICES+i*2+2)*11+5] = cosf(2*i*(float)PI/SLICES)
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


    def _update_slider_B ( )
        // on the first pass
        if _eboB == 0
            buffers : array of GLuint = {0, 0}
            glGenBuffers(buffers)
            _eboB = buffers[0]
            _vboB = buffers[1]

        posA : soy.atoms.Position = bodyA.position
        posB : soy.atoms.Position = bodyB.position

        // constants to help drawing
        radius : GLfloat = 0.15f // radius of second cylinder

        // distance in y-axis is yl
        yl : GLfloat = sqrtf((posB.x - posA.x) * (posB.x - posA.x) +
                             (posB.y - posA.y) * (posB.y - posA.y) +
                             (posB.z - posA.z) * (posB.z - posA.z))

        elements : array of GLushort = new array of GLushort[(4*SLICES)*3]
        vertices : array of GLfloat = new array of GLfloat[(4*SLICES+4)*11]

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
            vertices[(SLICES+i*2+1)*11+1] = -yl/2
            vertices[(SLICES+i*2+1)*11+2] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+4] = 0.0f
            vertices[(SLICES+i*2+1)*11+5] = cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+1)*11+6] = 1-i/(float)(SLICES)
            vertices[(SLICES+i*2+1)*11+7] = -1.0f
            vertices[(SLICES+i*2+1)*11+8] = 0.0f
            vertices[(SLICES+i*2+1)*11+9] = 1.0f
            vertices[(SLICES+i*2+1)*11+10] = 0.0f
            vertices[(SLICES+i*2+2)*11] = radius * sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+1] = 0.0f
            vertices[(SLICES+i*2+2)*11+2] = radius * cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+3] = sinf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+4] = 0.0f
            vertices[(SLICES+i*2+2)*11+5] = cosf(2*i*(float)PI/SLICES)
            vertices[(SLICES+i*2+2)*11+6] = 1-i/(float)(SLICES)
            vertices[(SLICES+i*2+2)*11+7] = 0.0f
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
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboB)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                     (GLsizei) (3 * 4 * SLICES * sizeof(GLushort)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vboB)
        glBufferData(GL_ARRAY_BUFFER,
                     (GLsizei) (11 * (4*SLICES+4) * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)
        // Reset updated flag
        _updated = false

    def addForce(force : ode.Real)
        ((ode.joints.Slider) self.joint).AddForce(force)

    //
    // axis Property
    _axis_obj : weak soy.atoms.Axis?

    def _axis_set(value : soy.atoms.Axis)
        axis : soy.atoms.Axis = new soy.atoms.Axis.normalize(value)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.Slider) joint).SetAxis((ode.Real) axis.x,
                                            (ode.Real) axis.y,
                                            (ode.Real) axis.z)
        soy.scenes._stepLock.writer_unlock()

    def _axis_weak(axis : Object)
        self._axis_obj = null

    prop axis : soy.atoms.Axis
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.Slider) self.joint).GetAxis(v)
            value : soy.atoms.Axis? = self._axis_obj
            if (value is null or (float) v.x != value.x or
                (float) v.y != value.y or (float) v.z != value.z)
                if value is not null
                    _axis_obj.on_set.disconnect(self._axis_set)
                    _axis_obj.weak_unref(self._axis_weak)
                value = new soy.atoms.Axis((float) v.x,
                                           (float) v.y,
                                           (float) v.z)
                value.on_set.connect(self._axis_set)
                value.weak_ref(self._axis_weak)
                self._axis_obj = value
            return value

        set
            self._axis_set(value)
            if _axis_obj != null
                _axis_obj.on_set.disconnect(self._axis_set)
                _axis_obj.weak_unref(self._axis_weak)
            _axis_obj = value
            value.on_set.connect(self._axis_set)
            value.weak_ref(self._axis_weak)

    //
    // length Property
    prop readonly length : float
        get
            return (float) ((ode.joints.Slider) self.joint).GetPosition()

/* TODO: These won't work until the parameters are in the vapi file
    prop stops : array of float
        owned get
            loangle : ode.Real = self.joint.GetParam(ode.dParamLoStop)
            hiangle : ode.Real = self.joint.GetParam(ode.dParamHiStop)

    prop bounces : float
        owned get
            return (float) self.joint.GetParam(ode.dParamBounce)
        set
            if (value < 0.0) or (value > 1.0)
                print "0.0 to 1.0 only"
                return
            self.joint.SetParam(ode.dParamBounce,(float)value)
*/