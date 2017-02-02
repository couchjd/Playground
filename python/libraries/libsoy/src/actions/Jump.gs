/*
 *  libsoy - soy.actions.Jump
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


class soy.actions.Jump : soy.actions.Action

	/*
	Soy actions Thrust

	This class makes a body jump depending on a vector
	*/

    _vector : soy.atoms.Vector

    construct (target : soy.bodies.Body, vector : soy.atoms.Vector)
        super ()
        setTarget(target)
        _vector = vector

	////////////////////////////////////////////////////////////////////////
    // Methods

    //Key Press
    def override hid_button_down (button : string)
        Jump(getTarget(), _vector)

    def Jump( target : soy.bodies.Body, vector : soy.atoms.Vector)
        // TODO: Jump method
