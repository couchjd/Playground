/*
 *  libsoy - soy.actions.Hover
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


 class soy.actions.Hover : soy.actions.Action

     /*
    Soy actions Hover

    This class controls pointer input, which is usually the mouse.
    */

    _hover : bool
    _targetX : int                                         // Target Pos X
    _targetY : int                                         // Target Pos Y
    _targetW : int                                         // Target Width
    _targetH : int                                         // Target Height

    init
        _hover = false

    construct (targetX : int, targetY : int, targetW : int, targetH : int)
        super()
        _targetX = targetX
        _targetY = targetY
        _targetW = targetW
        _targetH = targetH
  
    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override tp_repr(): string
        return "Hover"

    def override hid_moved (x : int, y : int)

        // Check horizontal bounds
        if (x >= _targetX) and (x <= (_targetX + _targetW))
            // Check vertical bounds
            if (y >= _targetY) and (y <= (_targetY + _targetH))
                _hover = true
                // onEnter

        else
            if(_hover)
                //onExit

            _hover = false
        
        return
