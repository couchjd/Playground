/*
 *  libsoy - soy.actions.Look
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


class soy.actions.Look : soy.actions.Action

    _lastX : float
    _lastY : float


    init
        hid_profiles = new array of soy.actions.Action.hid_profile[3]

        hid_profiles[0] = {
            "stick",                    // name
            new array of string[2],     // axis
            null,                       // buttons
            false,                      // pointer
            false,                      // text input
            0                           // touch
        }
        hid_profiles[0].axis[0] = "X"
        hid_profiles[0].axis[1] = "Y"

        hid_profiles[1] = {
            "mouse",                    // name
            null,                       // axis
            null,                       // buttons
            true,                       // pointer
            false,                      // text input
            0                           // touch
        }

        hid_profiles[2] = {
            "touch",                    // name
            null,                       // axis
            null,                       // buttons
            false,                      // pointer
            false,                      // text input
            1                           // touch
        }

    construct (target : soy.bodies.Body)
        super()
        setTarget(target)
        _lastX = 0.0f
        _lastY = 0.0f


    //////////////////////////////////////////////////////////////////////////
    // HID (Human Interface Device) interaction AP

    def override hid_axis_value ( axis : int8, value : float)
        if axis == 0
            getTarget().addTorque(0, -_lastX, 0)
            getTarget().addTorque(0, value, 0)
            _lastX = value

        if axis == 1
            getTarget().addTorque(-_lastY, 0, 0)
            getTarget().addTorque(value, 0, 0)
            _lastY = value

