/*
 *  libsoy - soy.events.ButtonPress
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

class soy.events.ButtonPress : soy.events.Device
    /*
    Soy device event

    ButtonPress is an event for button press.
    */

    _pointer : soy.controllers.Pointer
    _bindings : static dict of string, soy.actions.Action
    _button : string

    init
        _button = ""

    construct ( value : uint, _p : soy.controllers.Pointer)
        decodeKey(value)
        _pointer = _p

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def static init()
        _bindings = new dict of string, soy.actions.Action

    def static addAction ( button : string, action : soy.actions.Action )
        _bindings[button] = action

    def executeBinding()
        if(_bindings != null)
            for b in _bindings.keys 
                if b == _button
                    _bindings[b].hid_touch_down(_button, (int) _pointer.position.x, (int) _pointer.position.y)

    // Decodes button value to a button string
	def decodeKey(value : uint)

        case value
            
            when 1
                _button = "Left"

            when 2
                _button = "Mid"

            when 3
                _button = "Right"

            when 4
                _button = "WheelUp"

            when 5
                _button = "WheelDown"

            default
                // ... except for debugging
                print "Unknown button %u pressed", value
