/*
 *  libsoy - soy.scenes.Space
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
    GLib
    GL
    Gee
    ode
    GLib.Math

class soy.scenes.SpaceCell : Object
    x : int
    y : int
    z : int
    
    init
        x = 0
        y = 0
        z = 0
    
    construct ()
        pass

    construct from_position (position : soy.atoms.Vector, scale : float)
        x = (int)floor(position.x / scale)
        y = (int)floor(position.y / scale)
        z = (int)floor(position.z / scale)
    
    construct from_xyz (x : int, y : int, z : int)
        self.x = x
        self.y = y
        self.z = z
    
    def add (other : soy.scenes.SpaceCell)
        x += other.x
        y += other.y
        z += other.z
    
    def vector (scale : float) : soy.atoms.Vector
        return new soy.atoms.Vector(x * scale, y * scale, z * scale)
        
    def isNull () : bool
        return x == 0 && y == 0 && z == 0
    
class soy.scenes.SpaceBody : Object
    distance : float
    keep : bool
    position : soy.atoms.Position
    scale : float
    
    construct (distance : float, keep : bool)
        self.distance = distance
        self.keep = keep

class soy.scenes.Space : soy.scenes.Scene
    _size : float
    _space_bodies : dict of string, soy.scenes.SpaceBody
    _inactive_bodies : dict of string, soy.bodies.Body
    _removed_bodies : GLib.Queue of string
    _cell_changes : GLib.Queue of soy.scenes.SpaceCell
    _cell : soy.scenes.SpaceCell
    _scale : float

    construct (size : float, scale : float)
        _size = size
        _scale = scale
    
    init
        _space_bodies = new dict of string, soy.scenes.SpaceBody
        _inactive_bodies = new dict of string, soy.bodies.Body
        _removed_bodies = new GLib.Queue of string
        _cell_changes = new GLib.Queue of soy.scenes.SpaceCell
        _cell = new soy.scenes.SpaceCell

    def override pre_render (camera : soy.bodies.Camera)
        //pre render: set position + scale accordingly
    
        //test : GLib.Queue of string = new GLib.Queue of string  //(currently not used)
    
        pos : array of float = camera.getPositionf()
        
        cam_pos : soy.atoms.Vector = new soy.atoms.Vector(pos[0], pos[1], pos[2])
        
        cam_cell : soy.scenes.SpaceCell = new soy.scenes.SpaceCell.from_position(cam_pos, _scale)
        _cell.add(cam_cell)
        
        cam_trans : soy.atoms.Vector = cam_cell.vector(_scale)
        
        if !cam_cell.isNull()
            _cell_changes.push_tail(cam_cell)
        
        cam_pos.subtract(cam_trans)

        far_half : float = camera.zfar / 2
        log_far_half : float = (float)GLib.Math.log(far_half)
        
        distance_b : float = far_half / ((float)GLib.Math.log(_size) - log_far_half)
        distance_a : float = far_half - distance_b * log_far_half
        
        to_change : list of string = new list of string
        
        for name in self.bodies.keys
            body : soy.bodies.Body = self.bodies[name]
            sbody : soy.scenes.SpaceBody = _space_bodies[name]
            
            pos = body.getPositionf()
            
            position : soy.atoms.Vector = new soy.atoms.Vector(pos[0], pos[1], pos[2])
            
            position.subtract(cam_trans)
            
            body.position = new soy.atoms.Position(position.x, position.y, position.z)
            
            position.subtract(cam_pos)
            
            sbody.position = body.position
            
            var distance = position.magnitude()
            
            if distance > sbody.distance
                to_change.add(name)
                if sbody.keep
                    _inactive_bodies[name] = body
                else
                    _removed_bodies.push_tail(name)
                continue
                
            if distance > far_half
                new_distance : float = distance_a + distance_b * (float)GLib.Math.log(distance)
                position.multiply(new_distance / distance)
                position.add(cam_pos)
                body.position = new soy.atoms.Position(position.x, position.y, position.z)
                body.scale = new_distance / distance
    
        for name in to_change
            bodies.unset(name)
    
        to_change = new list of string
        
        for name in self._inactive_bodies.keys
            body : soy.bodies.Body = self._inactive_bodies[name]
            sbody : soy.scenes.SpaceBody = _space_bodies[name]
            
            sbody.position.x -= cam_trans.x
            sbody.position.y -= cam_trans.y
            sbody.position.z -= cam_trans.z
            
            position : soy.atoms.Vector = new soy.atoms.Vector(sbody.position.x, sbody.position.y, sbody.position.z)
            
            position.subtract(cam_pos)
            
            var distance = position.magnitude()
            
            if distance < sbody.distance
                bodies[name] = body
                to_change.add(name)
                
        for name in to_change
            _inactive_bodies.unset(name)
        
        return

    def override post_render (view : array of GLfloat, projection : array of
                              GLfloat, camera : soy.bodies.Camera, lights :
                              array of soy.bodies.Light)
        //post render: reset position/scale
    
        for name in self.bodies.keys
            body : soy.bodies.Body = self.bodies[name]
            sbody : soy.scenes.SpaceBody = _space_bodies[name]
            
            body.position = sbody.position
            body.scale = 1
        
        return

    def override body_update (key : string, value : soy.bodies.Body?)
        if !(key in _space_bodies.keys)
            _space_bodies[key] = new soy.scenes.SpaceBody(1000, true)

    def override body_remove (key : string)
        _space_bodies.unset(key)
        _inactive_bodies.unset(key)
    
    def get_distance (key : string) : float
        if key in _space_bodies.keys
            return _space_bodies[key].distance
        return 0.0f

    def set_distance (key : string, distance : float)
        if key in _space_bodies.keys
            _space_bodies[key].distance = distance

    def get_keep (key : string) : bool
        if key in _space_bodies.keys
            return _space_bodies[key].keep
        return false

    def set_keep (key : string, keep : bool)
        if key in _space_bodies.keys
            _space_bodies[key].keep = keep

    def get_active (key : string) : bool
        return !(key in _inactive_bodies.keys)

    def get_position (key : string, x : float*, y : float*, z : float*) : bool
        mutex.lock()
        if key in bodies.keys
            position = bodies[key].position
            *x = position.x
            *y = position.y
            *z = position.z
            mutex.unlock()
            return true
        else if key in _space_bodies.keys
            position = _space_bodies[key].position
            *x = position.x
            *y = position.y
            *z = position.z
            mutex.unlock()
            return true
        mutex.unlock()
        return false

    def set_position (key : string, x : float, y : float, z : float) : bool
        mutex.lock()
        if key in bodies.keys
            position = bodies[key].position
            position.x = x
            position.y = y
            position.z = z
            mutex.unlock()
            return true
        mutex.unlock()
        return false

    def get_cell () : soy.scenes.SpaceCell
        return _cell
        
    def poll_removed () : string?
        return _removed_bodies.pop_head()

    def poll_transitions() : soy.scenes.SpaceCell?
        return _cell_changes.pop_head()
