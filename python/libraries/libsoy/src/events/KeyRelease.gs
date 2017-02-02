/*
 *  libsoy - soy.events.KeyRelease
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

class soy.events.KeyRelease : soy.events.Device
    /*
    Soy device event

    KeyRelease is an event for key release.
    */

    _keyboard : soy.controllers.Keyboard
    _bindings : static dict of string, soy.actions.Action
    _key : string

    init
        _key = ""

    construct (value : uint, _k : soy.controllers.Keyboard)
        decodeKey(value)
        _keyboard = _k
        if(_key != "")
            _keyboard.removeKey(_key)

    ////////////////////////////////////////////////////////////////////////
    // Methodss

    def static init()
        _bindings = new dict of string, soy.actions.Action

    def static addAction( key : string, action : soy.actions.Action )
        _bindings[key] = action

    def executeBinding()
        if(_bindings != null)
            for k in _bindings.keys 
                if k == _key
                    _bindings[k].hid_button_up(_key)

    // Decodes key value to key string
    def decodeKey(value : uint)
        case value

            // Missing special characters and operators

            // Letters
            when 24
                _key = "Q"

            when 25
                _key = "W"

            when 26
                _key = "E"

            when 27
                _key = "R"

            when 28
                _key = "T"

            when 29
                _key = "Y"

            when 30
                _key = "U"

            when 31
                _key = "I"

            when 32
                _key = "O"

            when 33
                _key = "P"

            when 38
                _key = "A"

            when 39
                _key = "S"

            when 40
                _key = "D"

            when 41
                _key = "F"

            when 42
                _key = "G"

            when 43
                _key = "H"

            when 44
                _key = "J"

            when 45
                _key = "K"

            when 46
                _key = "L"

            when 52
                _key = "Z"

            when 53
                _key = "X"

            when 54
                _key = "C"

            when 55
                _key = "V"

            when 56
                _key = "B"

            when 57
                _key = "N"

            when 58
                _key = "M"

            // Numbers
            when 10
                _key = "1"

            when 11
                _key = "2"

            when 12
                _key = "3"

            when 13
                _key = "4"

            when 14
                _key = "5"

            when 15
                _key = "6"

            when 16
                _key = "7"

            when 17
                _key = "8"

            when 18
                _key = "9"

            when 19
                _key = "0"

            // NumPad Numbers
            when 87
                _key = "Num1"

            when 88
                _key = "Num2"

            when 89
                _key = "Num3"

            when 83
                _key = "Num4"

            when 84
                _key = "Num5"

            when 85
                _key = "Num6"

            when 79
                _key = "Num7"

            when 80
                _key = "Num8"

            when 81
                _key = "Num9"

            when 90
                _key = "Num0"

            // Other keys
            when 50
                _key = "LShift"

            when 62
                _key = "RShift"

            when 37
                _key = "LCtrl"

            when 105
                _key = "RCtrl"

            when 65
                _key = "Space"

            when 64
                _key = "Alt"

            when 108
                _key = "AltGr"

            when 23
                _key = "TAB"

            when 22
                _key = "BackSpace"

            when 36
                _key = "Enter"

            when 104
                _key = "EnterNum"

            when 9
                _key = "Esc"

            when 119
                _key = "Delete"

            when 118
                _key = "Insert"

            when 112
                _key = "PageUp"

            when 117
                _key = "PageDown"

            when 110
                _key = "Home"

            when 115
                _key = "End"

            when 77
                _key = "NumLock"

            // DPad
            when 111
                _key = "Up"

            when 116
                _key = "Down"

            when 113
                _key = "Left"

            when 114
                _key = "Right"

            // Funtions
            when 67
                _key = "F1"

            when 68
                _key = "F2"

            when 69
                _key = "F3"

            when 70
                _key = "F4"

            when 71
                _key = "F5"

            when 72
                _key = "F6"

            when 73
                _key = "F7"

            when 74
                _key = "F8"

            when 75
                _key = "F9"

            when 76
                _key = "F10"

            when 95
                _key = "F11"

            when 96
                _key = "F12"

            default
                // ... except for debugging
                print "Unknown key %u relesed", value
