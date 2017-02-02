/*
 *  GtkSoy - PySoy GTK Client for GTK based applications
 *  Copyright (C) 2013,2014 Copyleft Games Group
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
    EGL
    Gtk


class soy.Client : Object

    prop readonly window : soy.widgets.Window
    prop readonly address : string
    plug : Gtk.Plug?

    event on_close ()
    closing : bool
    xDisplay : unowned X.Display?

    _eglConfig : EGLConfig
    _eglContext : EGLContext
    _eglDisplay : EGLDisplay
    _eglSurface : EGLSurface?

    _xWindow : X.Window
    _wm_delete_window : X.Atom

    _window_size : soy.atoms.Size

    area : Gtk.DrawingArea
    
    init
    
        argv : unowned array of string? = null
        Gtk.init(ref argv)
        
        _address = ""

        _window = new soy.widgets.Window()

        _window_size = _window.size
        _window_size.on_set.connect(_on_resize)

        if soy._client_thread is null
            soy._client_thread = new soy._ClientThread()
            
        var source = new TimeoutSource(25)
        source.set_callback(thread_step)
        var a = source.attach(soy._client_thread.context)

    final
    
        // Wait until background thread has finished
        while xDisplay is not null
            Thread.usleep(10)

    def _configure (event : Gdk.EventConfigure) : bool
        
        _window_size.width = event.width
        _window_size.height = event.height
        
        return true

    def thread_step () : bool
        
        if closing
            xDisplay = null
            return false

        if plug is null
            windowid : uint64 = uint64.parse(
                GLib.Environment.get_variable("GTKSOY_SID")
            )
            if windowid <= 0
                print "Err: GTKSOY_SID not set"
                return false
               
            plug = new Gtk.Plug((X.Window) windowid)
            plug.destroy.connect(_on_close)
            
            area = new Gtk.DrawingArea()
            area.set_size_request((int) _window_size.width, (int) _window_size.height) 
            area.set_double_buffered(false)
            area.add_events(Gdk.EventMask.ALL_EVENTS_MASK)
            area.configure_event.connect(_configure)
            area.draw.connect(_on_draw)
            
            plug.add(area)
            plug.show_all()
            
            major   : int
            minor   : int
            matches : int
            winattr : X.SetWindowAttributes = X.SetWindowAttributes()
            
            var area_window = area.get_window ()
            _xWindow = Gdk.X11Window.get_xid(area_window)
            xDisplay = Gdk.X11Display.get_xdisplay(area.get_window().get_display())
            if xDisplay is null
                print "Could not open X11 display."
                return false
                
            _eglDisplay = eglGetDisplay(xDisplay)
            var xVisInfo = X.VisualInfo()
            xVisInfo = xDisplay.get_visual_info(0, xVisInfo, out matches)
            var visualid = (int) xVisInfo.visualid
            // Copy X11 depth into EGL attributes
            egl_attrs : array of EGLint = {
                EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,    // OpenGL ES 2.0
                EGL_NATIVE_VISUAL_ID, visualid,             // Use X11 VisualID
                EGL_DEPTH_SIZE, 16,                         // Depth
                EGL_STENCIL_SIZE, 1,                        // Stencil
                EGL_NONE
            }
            
            ctx_attrs : array of EGLint = {
                EGL_CONTEXT_CLIENT_VERSION, 2,              // OpenGL ES 2.0
                EGL_NONE
            }        
            
            if not eglInitialize(_eglDisplay, out major, out minor)
                print "Failed to initialize EGL."
                return false
            
            // Check EGL version
            if major != 1 or minor < 3
                print "EGL version %i.%i not supported.", major, minor
                return false
                
            configs : array of EGLConfig = {_eglConfig}
            if (!eglChooseConfig(_eglDisplay, egl_attrs, configs,
                                 out matches) or matches == 0)
                print "EGL configuration failed."
            _eglConfig = configs[0]

            eglBindAPI(EGL_OPENGL_ES_API)
            // Get eglContext
            _eglContext = eglCreateContext(_eglDisplay, _eglConfig,
                                           EGL_NO_CONTEXT, ctx_attrs)
            if _eglContext == EGL_NO_CONTEXT
                print "Could not create EGL context"
                return false
                
            // Listen for CreateNotify events on root window
            winattr.event_mask = X.EventMask.SubstructureNotifyMask
            xDisplay.change_window_attributes(xDisplay.default_root_window(),
                                               X.CW.EventMask, winattr)
            Gtk.main()                                   

        return true

    def window_client (event : X.ClientMessageEvent)
        if event.l[0] == _wm_delete_window
            // Signal interested parties
            on_close()

            // Tell background thread to close
            closing = true

    def _on_close (widget : Gtk.Widget)
        print "on_close"

    def _on_resize (size : soy.atoms.Size)
    
        _window.width = (int) size.width
        _window.height = (int) size.height
        
        return


    def _on_draw (widget : Gtk.Widget, cc : Cairo.Context) : bool
    
        if _eglSurface is null
            // Get EGLSurface
            _eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig,
                                                 _xWindow, null)
            area.get_window().flush()

        // Activate window
        eglMakeCurrent(_eglDisplay, _eglSurface, _eglSurface,
                       _eglContext)

        // Draw window
        _window.draw()
        
        size : int = int.min(_window.width, _window.height)
        glViewport((window.width-size) / 2, (window.height-size) / 2,
                    size, size)

        // Push color buffer to window
        eglSwapBuffers(_eglDisplay, _eglSurface)

        area.get_window().invalidate_rect(null, false)
        area.get_window().process_updates(false)
        area.get_window().flush()

        return true
