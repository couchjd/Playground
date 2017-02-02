/*
 *  libsoy - soy.textures.SVGTexture
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
    GL

class soy.textures.SVGTexture : soy.textures.Texture
    
    _mutex : Mutex
    _context : Cairo.Context?
    _handle : Rsvg.Handle?
    _surface : Cairo.ImageSurface?

    init
        _mutex = Mutex()
        _context = null
        _handle = null
        _surface = null

    construct ()
        channels = 3
        _source_new = false

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _source : string
    _source_new : bool
    prop source : string
        get
            return _source
        set
            _mutex.lock()
            if value != _source
                _source = value
                _source_new = true
            _mutex.unlock()

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override enable ()
        _mutex.lock()
        if _source_new
            _handle = new Rsvg.Handle.from_data((array of uint8)source.to_utf8())
            if _surface == null || _surface.get_width() != _handle.width ||  _surface.get_height() != _handle.height
                _surface = new Cairo.ImageSurface(Cairo.Format.ARGB32, _handle.width, _handle.height)
                if _surface.status() != Cairo.Status.SUCCESS
                    raise new MemoryError.OUT_OF_MEMORY ("Out of memory")
                    
            _context = new Cairo.Context(_surface)
            op : Cairo.Operator = _context.get_operator()
            _context.set_operator(Cairo.Operator.CLEAR)
            _context.set_source_rgba(0, 0, 0, 0)
            _context.rectangle(0, 0, _surface.get_width(), _surface.get_height())
            _context.fill()
            _context.set_operator(op)
            _handle.render_cairo(_context)
            self.copySurface(_surface)
            self.translucent = channels % 2 is 0

            _source_new = false
        _mutex.unlock()
    
        super.enable()
