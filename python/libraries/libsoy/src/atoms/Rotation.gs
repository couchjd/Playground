/*
 *  libsoy - sob.atoms.Vector
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
 *  You should have received alphacopy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    GLib
    GLib.Math


class soy.atoms.Rotation : Object
    event on_set (Rotation : Rotation)

    construct (w : float = 1.0f, x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._w = w
        self._x = x
        self._y = y
        self._z = z

    def new set (w : float = 1.0f, x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._w = w
        self._x = x
        self._y = y
        self._z = z
        self.on_set(self)

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def getLookAt() : soy.atoms.Vector
        return new soy.atoms.Vector(-2 * (self.w * self.y + self.x * self.z),
                2 * (self.x * self.w - self.z * self.y),
                2 * (self.x * self.x + self.y * self.y) - 1)
    
    def getUp() : soy.atoms.Vector
        return new soy.atoms.Vector(2 * (self.x * self.y - self.w * self.z),
                1 - 2 * (self.x * self.x + self.z * self.z),
                2 * (self.w * self.x + self.y * self.z))

    def add(other : soy.atoms.Rotation) : soy.atoms.Rotation
        return new soy.atoms.Rotation(self.w + other.w, self.x + other.x, self.y + other.y, self.z + other.z)
    
    def mul(other : soy.atoms.Rotation) : soy.atoms.Rotation
        return new soy.atoms.Rotation(  self.w * other.w - self.x * other.x - self.y * other.y - self.z * other.z,
                                        self.w * other.x + self.x * other.w + self.y * other.z - self.z * other.y,
                                        self.w * other.y - self.x * other.z + self.y * other.w + self.z * other.x,
                                        self.w * other.z + self.x * other.y - self.y * other.x + self.z * other.w )

    def dot(other : soy.atoms.Rotation) : float
        return self.w * other.w + self.x * other.x + self.y * other.y + self.z * other.z
    
    def norm() : float
        return self.dot(self)
    
    def length() : float
        return sqrtf(self.norm())
    
    def normalize()
        l : float = self.length()
        self.w /= l
        self.x /= l
        self.y /= l
        self.z /= l
    
    def conjugate() : soy.atoms.Rotation
        return new soy.atoms.Rotation(self.w, -self.x, -self.y, -self.z)
    
    def rotate(v : soy.atoms.Vector) : soy.atoms.Vector
        temp : soy.atoms.Rotation = self.mul(new soy.atoms.Rotation(0, v.x, v.y, v.z).mul(self.conjugate()))
        return new soy.atoms.Vector(temp.x, temp.y, temp.z)

    def toEuler() : soy.atoms.Vector
        test : float = self.x * self.y + self.z * self.w
        if test > 0.4999999
            return new soy.atoms.Vector( 2 * atan2f(self.x, self.w),  (float)PI / 2, 0)
        else if test < -0.499999
            return new soy.atoms.Vector(-2 * atan2f(self.x, self.w), -(float)PI / 2, 0)
        
        //sqw : float = self.w * self.w  //(currently not used)
        sqx : float = self.x * self.x
        sqy : float = self.y * self.y
        sqz : float = self.z * self.z

        return new soy.atoms.Vector(atan2f(2 * (self.w * self.x + self.y * self.z), 1 - 2 * (sqx + sqy)),
                asinf(-2 * (self.x * self.z - self.w * self.y)),
                atan2f(2 * (self.x * self.y + self.w * self.z), 1 - 2 * (sqy + sqz)))

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _w : float
    prop w : float
        get
            return self._w
        set
            self._w = value
            self.on_set(self)

    _x : float
    prop x : float
        get
            return self._x
        set
            self._x = value
            self.on_set(self)

    _y : float
    prop y : float
        get
            return self._y
        set
            self._y = value
            self.on_set(self)

    _z : float
    prop z : float
        get
            return self._z
        set
            self._z = value
            self.on_set(self)


    def static cmp_eq (left : Object, right : Object) : bool
        if not (left isa soy.atoms.Rotation) or not (right isa soy.atoms.Rotation)
            return false

        _a : bool = ((soy.atoms.Rotation) left).w == ((soy.atoms.Rotation) right).w
        _b : bool = ((soy.atoms.Rotation) left).x == ((soy.atoms.Rotation) right).x
        _c : bool = ((soy.atoms.Rotation) left).y == ((soy.atoms.Rotation) right).y
        _d : bool = ((soy.atoms.Rotation) left).z == ((soy.atoms.Rotation) right).z

        return (_a & _b & _c & _d)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
