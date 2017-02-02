/*
 *  libsoy - soy.actions.Action
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


class soy.actions.Action : Object

    init
        hid_mode = -1
        hid_profiles = null


    prop profile : string
        get
            if hid_mode == -1
                return ""
            return hid_profiles[hid_mode].name

    //////////////////////////////////////////////////////////////////////////
    // HID (Human Interface Device) interaction API
    //
    // This is for use by clients and should not be exposed to Python

    struct hid_profile
        name : string                   // profile name
        axis : array of string          // how many axis and their labels
        buttons : array of string       // how many buttons and their labels
        pointer : bool                  // pointer position needed
        text : bool                     // text input needed
        touch : int8                    // touch input needed


    hid_profiles : array of hid_profile
    _target : soy.bodies.Body

    def virtual tp_repr ( ) : string
        return "Action"

    hid_mode : int

    def virtual hid_axis_value (axis : int8, value : float)
        return


    def virtual hid_button_down (button : string)
        return


    def virtual hid_button_up (button : string)
        return


    def virtual hid_text (text : string)
        return


    def virtual hid_touch_down (button : string, x : int, y : int)
        return


    def virtual hid_touch_drag (button : string, x : int, y : int)
        return


    def virtual hid_touch_up (button : string, x : int, y : int)
        return

    def virtual hid_moved (x : int, y : int)
        return

    def setTarget(target : soy.bodies.Body)
        _target = target
        return

    def getTarget() : soy.bodies.Body
        return _target
