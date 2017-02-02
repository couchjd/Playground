/*
 *  libsoy - soy.events.Motion
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


class soy.events.Motion : soy.events.Event 

    /*
    Soy Events Motion

    Motion is an event for Pointer Motion.
    */

    x : int
    y : int
    x_root : int
    y_root : int
    _pointer : soy.controllers.Pointer
    _bindings : static list of soy.actions.Action

    construct ( _x : int, _y : int, _x_root : int, _y_root : int, _p : soy.controllers.Pointer)
        _pointer = _p
        x = _x
        y = _y
        x_root = _x_root
        y_root = _y_root
        _pointer.motion(x, y)

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def static init()
        _bindings = new list of soy.actions.Action

    def static addAction( action : soy.actions.Action )
        _bindings.add(action)


    def executeBindings()
        if(_bindings != null)
            for k in _bindings
                k.hid_moved(x, y)
