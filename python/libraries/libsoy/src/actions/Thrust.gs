/*
 *  libsoy - soy.actions.Thrust
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


 class soy.actions.Thrust : soy.actions.Action

    /*
    Soy actions Thrust

    This class sets a thrust to a body depending on a vector
    */

    //_target : soy.bodies.Body
    _vector : soy.atoms.Vector 

    construct (tgt : soy.bodies.Body, vec : soy.atoms.Vector)
        super ()
        setTarget(tgt)
        _vector = vec

    ////////////////////////////////////////////////////////////////////////
    // Methods

    // TODO: Finish thrust method

    // Key Press
    def override hid_button_down (button : string)
        _thrust (getTarget(), _vector)

    // Key Release
    def override hid_button_up (button : string)
        _thrust (getTarget(), _vector)

    def _thrust (target : soy.bodies.Body, vector : soy.atoms.Vector)
        target.addForce(vector.x, vector.y, vector.z)
