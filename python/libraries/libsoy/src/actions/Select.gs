/*
 *  libsoy - soy.actions.Select
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
    ode

class soy.actions.Select : soy.actions.Action
    /*
    Soy actions Select

    This class handles selection with a pointer.
    */

    _action : soy.actions.Action                           // Action to be executed on target
    _scene : soy.scenes.Scene                              // Scene with the selectable bodies
    _selected : soy.bodies.Body                            // Last selected body
    _selectedGeom : ode.geoms.Geom*                        // 
    _tempRay : ode.geoms.Ray*                              //

    construct (action : soy.actions.Action , scene : soy.scenes.Scene)
        super()
        _action = action
        _scene = scene

    def override tp_repr(): string
        return "Select"

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override hid_touch_down (button : string, x : int, y : int)
        _selected = _select(x,y)
        if _selected != null
            _action.setTarget(_selected)

        return

    def _select( x : int, y : int) : soy.bodies.Body

        //_stepLock.writer_lock()                  //Try

        _tempRay = new ode.geoms.Ray(_scene.space, 500)
        _tempRay->Set((ode.Real) x, (ode.Real) y, 0, 0, 0, -1)
        _tempRay->SetLength(500)

        _scene.space.Collide(self._check_collision_NearCallback)

        //_stepLock.writer_unlock()                //Try

        return _getBody(_selectedGeom)

    def _check_collision_NearCallback( o1 : ode.geoms.Geom, o2 : ode.geoms.Geom )

        // If o1 or o2 are _tempRay
        if ( o1 == _tempRay ) | ( o2 == _tempRay)
            contactGeoms : ode.ContactGeomArray* = new ode.ContactGeomArray(1)
            num : int = o1.Collide(o2, 1, contactGeoms, (int) sizeof(ode.ContactGeom))

            if num != 0

                if o1 == _tempRay
                    _selectedGeom = o1

                else
                    _selectedGeom = o2

                return 

        return

    def _getBody(geom : ode.geoms.Geom) : soy.bodies.Body

        for k in _scene.bodies.keys
            if _scene.bodies[k].geom == geom
                return _scene.bodies[k]

        return null
         