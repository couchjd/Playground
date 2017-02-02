/*
 *  libsoy - soy.bodies.Camera
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
    ode
    soy
    soy.atoms

class soy.bodies.Camera : soy.bodies.Body
    _znear : GLfloat
    _zfar  : GLfloat

    init
        _lens = 45.0f
        _znear = 1.0f
        _zfar  = 2560.0f


    construct (position : soy.atoms.Position?, radius : float = 1.0f)
        super(position, null, 0.0f)
        _radius = radius


    def projectVector (v : Vector, aspect : float) : Vector
        // This function replaces gluPerspective for GLES
        
        zFar : float = _zfar
        zNear : float = _znear
        fovy : float = _lens
        
        m : array of GLfloat
        deltaZ : float = zFar - zNear
        radians : float = fovy / 2.0f * 3.141592653589793f / 180.0f
        sine : float = Posix.sinf(radians)

        // Bail now if parameters would divide by zero
        if ((deltaZ == 0.0f) || (sine == 0.0f) || (aspect == 0.0f))
            return new Vector(0, 0, 0)

        cotangent : float = Posix.cosf(radians) / sine

        // Set matrix
        m = {
            1.0f,   0.0f,   0.0f,   0.0f,
            0.0f,   1.0f,   0.0f,   0.0f,
            0.0f,   0.0f,   1.0f,  -1.0f,
            0.0f,   0.0f,   0.0f,   0.0f}
        m[0] = cotangent / aspect
        m[5] = cotangent
        m[10] = -(zFar + zNear) / deltaZ
        m[14] = -2.0f * zNear * zFar / deltaZ
        
        x : float = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12]
        y : float = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13]
        z : float = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14]
        w : float = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15]
        
        return new Vector(x / w, y / w, z / w)
    //prop wireframe

    //prop lens
    _lens  : GLfloat
    prop lens : float
        get
            return self._lens
        set
            // TODO test value to ensure it won't crash something
            self._lens = value


    //prop direction

    //prop right

    //prop up

    // prop radius
    _radius : GLfloat
    prop radius : float
        get
            return self._radius
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._radius = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()

            self.set_mass (self.density)
            
    prop zfar : float
        get
            return self._zfar

    def project (aspect : GLfloat, x: int, y : int, width : int, height : int)
        if (scene is null)
            return

        self.scene.render(self._lens, aspect, self._znear, self._zfar, self, x, y, width, height)

    def override set_mass (density : float)
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetSphere(density, _radius)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

