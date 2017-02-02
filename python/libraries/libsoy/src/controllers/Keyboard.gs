/*
 *  libsoy - soy.controllers.Keyboard
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
    Gee


class soy.controllers.Keyboard : soy.controllers.Controller
    /*
    Soy Keyboard Controller

    This class controls keyboard input.
    */

    // set of keys being held down
    _downed_keys : static list of string
    
    init
        _downed_keys = new list of string

        key_press += def (t,e)
            e.executeBinding()

        key_release += def (t,e)
            e.executeBinding()

    ////////////////////////////////////////////////////////////////////////
    // Events
    event key_press (e : soy.events.KeyPress)
    event key_release (e : soy.events.KeyRelease)     

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override tp_repr ( ) : string
        return "Keyboard"

    def addKey(key : string)
        _downed_keys.add(key)

    def removeKey(key : string)
        _downed_keys.remove(key)
