/*
 *  libsoy - soy.joints.Joint
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
    soy.atoms
    GL
    ode
    GLib.Math

class soy.joints.Joint : Object
    joint : ode.joints.Joint
    bodyA : weak soy.bodies.Body
    bodyB : weak soy.bodies.Body?
    mutex : Mutex

    init
        // ensures that vbos and materials do not change while joint is rendered
        mutex = Mutex()

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
              axis2 : soy.atoms.Axis?, material : soy.materials.Material?)
        self.bodyA = bodyA
        self.bodyB = bodyB
        self._material = material

        // Lock scene until were done
        soy.scenes._stepLock.writer_lock()

        // Create joint
        self.create()

        // Store a ref to self it ODE joint
        joint.SetData((void*) self)

        // Attach joint to body/ies
        if bodyB == null
            joint.Attach(bodyA.body, null)
        else
            joint.Attach(bodyA.body, bodyB.body)

        // Setup joint
        self.setup(anchor, axis1, axis2)

        // add self to scenes for rendering
        // FIXME this breaks when moving bodies between scenes
        bodyA.scene.joints.add(self)

        // generate rotation matrices
        self.gen_matrices()

        // Unlock scene
        soy.scenes._stepLock.writer_unlock()


    def virtual create ( )
        self.joint = new ode.joints.Joint(soy.scenes._world, null)


    def virtual setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                       axis2 : soy.atoms.Axis?)
        return


    def virtual gen_matrices ( )
        return


    def virtual render ( alpha_stage : bool, view : array of GLfloat,
                         projection : array of GLfloat, lights :
                         array of soy.bodies.Light, ambient :
                         array of GLfloat )
        return


    def virtual model_matrix_A( ) : array of GLfloat
        var _mtx = new array of GLfloat[16]
        rotationA : unowned ode.Matrix3 = bodyA.body.GetRotation()
        positionA : unowned ode.Vector3 = bodyA.body.GetPosition()

        _mtx[0]  = (GLfloat) rotationA.m0
        _mtx[1]  = (GLfloat) rotationA.m4
        _mtx[2]  = (GLfloat) rotationA.m8
        _mtx[3]  = (GLfloat) 0.0
        _mtx[4]  = (GLfloat) rotationA.m1
        _mtx[5]  = (GLfloat) rotationA.m5
        _mtx[6]  = (GLfloat) rotationA.m9
        _mtx[7]  = (GLfloat) 0.0
        _mtx[8]  = (GLfloat) rotationA.m2
        _mtx[9]  = (GLfloat) rotationA.m6
        _mtx[10] = (GLfloat) rotationA.ma
        _mtx[11] = (GLfloat) 0.0
        _mtx[12] = (GLfloat) positionA.x
        _mtx[13] = (GLfloat) positionA.y
        _mtx[14] = (GLfloat) positionA.z
        _mtx[15] = (GLfloat) 1.0

        return _mtx


    def virtual model_matrix_B( ) : array of GLfloat
        var _mtx = new array of GLfloat[16]
        rotationB : unowned ode.Matrix3 = bodyB.body.GetRotation()
        positionB : unowned ode.Vector3 = bodyB.body.GetPosition()

        _mtx[0]  = (GLfloat) rotationB.m0
        _mtx[1]  = (GLfloat) rotationB.m4
        _mtx[2]  = (GLfloat) rotationB.m8
        _mtx[3]  = (GLfloat) 0.0
        _mtx[4]  = (GLfloat) rotationB.m1
        _mtx[5]  = (GLfloat) rotationB.m5
        _mtx[6]  = (GLfloat) rotationB.m9
        _mtx[7]  = (GLfloat) 0.0
        _mtx[8]  = (GLfloat) rotationB.m2
        _mtx[9]  = (GLfloat) rotationB.m6
        _mtx[10] = (GLfloat) rotationB.ma
        _mtx[11] = (GLfloat) 0.0
        _mtx[12] = (GLfloat) positionB.x
        _mtx[13] = (GLfloat) positionB.y
        _mtx[14] = (GLfloat) positionB.z
        _mtx[15] = (GLfloat) 1.0

        return _mtx

    def mult_matrix(a : array of GLfloat, b : array of GLfloat) : array of GLfloat
        mtx : array of GLfloat[16] = new array of GLfloat[16]
        for var r=0 to 3
            for var c=0 to 3
                mtx[4*r+c] = 0.0f
                for var j=0 to 3
                    mtx[4*r+c] += (b[4*j+c] * a[4*r+j])
        return mtx

    ////////////////////////////////////////////////////////////////////////
    //
    // Material property
    _material : soy.materials.Material?
    prop material : soy.materials.Material?
        get
            return _material
        set
            mutex.lock()
            _material = value
            mutex.unlock()

