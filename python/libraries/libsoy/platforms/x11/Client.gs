/*
 *  libsoy - soy.Client for X11
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
    EGL
    GLib


class soy.Client : Object
    event on_close ()

    prop readonly address : string

    prop readonly window : soy.widgets.Window

    closing : bool
    _eglConfig : EGLConfig
    _eglContext : EGLContext
    _eglDisplay : EGLDisplay
    _eglSurface : EGLSurface?
    _window_size : soy.atoms.Size
    _wm_delete_window : X.Atom
    xDisplay : X.Display?
    _xVisInfo : X.VisualInfo
    _xWindow : X.Window?


    init
        // Set empty address
        _address = ""

        // Create new window
        _window = new soy.widgets.Window()

        // Get a hook for the new window's size
        _window_size = _window.size
        _window_size.on_set.connect(self.window_resize)

        // TODO hook into position, title, icon, etc

        // Set empty controllermap
        //self->controllers = (PySoy_Client__ControllerMap_Object*)
        //    PyType_GenericNew(&PySoy_Client__ControllerMap_Type,
        //                      NULL, NULL);
        //self->controllers->map = g_hash_table_new_full(g_int_hash, g_int_equal,
        //                                               g_free, g_object_unref);
        //self->pointer = NULL;
        //self->keyboard = NULL;


        // Launch background thread if it hasn't already
        if soy._client_thread is null
            soy._client_thread = new soy._ClientThread()

        // Add event source to be called every 25ms (40fps)
        var source = new TimeoutSource(25)
        source.set_callback(thread_step)
        source.attach(soy._client_thread.context)

    final
        // Wait until background thread has finished
        while xDisplay is not null
            Thread.usleep(10)


    def thread_step () : bool
        major : int
        minor : int
        matches : int
        winattr : X.SetWindowAttributes = X.SetWindowAttributes()

        // If window has been closed, stop rendering
        if closing
            _xWindow = null
            xDisplay = null
            return false

        //
        // If window is already open, render to it
        if _xWindow is not null
            // Retitle window (if retitled)
            /*
            if (soy_widgets_window_get_retitle(
                                ((PySoy_widgets_Window_Object*) self->window)->g)) {
                char* title = (char*) soy_widgets_window_get_title(
                                  ((PySoy_widgets_Window_Object*) self->window)->g);
                XSetStandardProperties(x11Display, self->window_id, title, title,
                                       None, NULL, 0, NULL);
                soy_widgets_window_set_retitle(((PySoy_widgets_Window_Object*) self
                                          ->window)->g, FALSE);
            }

            if(((PySoy_widgets_Widget_Object*) self->window)->g->resized) {
                XResizeWindow(x11Display, self->window_id,
                              ((PySoy_widgets_Widget_Object*) self->window)->g->width,
                              ((PySoy_widgets_Widget_Object*) self->window)->g->height);
                ((PySoy_widgets_Widget_Object*) self->window)->g->resized = FALSE;
            }
            */

            if xDisplay is not null
                xDisplay.ClearArea(_xWindow, 0, 0, 0, 0, true)

            xDisplay.flush()
            return true

        //
        // Open X11 connection if it is not yet
        if xDisplay is null

            // Open X11 display
            xDisplay = new X.Display()
            if xDisplay is null
                print "Could not open X11 display."
                return false

            // Get the current X11 depth
            _xVisInfo = xDisplay.get_visual_info(0, null, out matches)
            if matches == 0
                print "Could not get XVisual"
                return false
            visualid : int = (int) _xVisInfo.visualid

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

            /*
            // Check for XInput extension
            int event, err;
            if (!XQueryExtension(x11Display, "XInputExtension", &xi2_opcode,
                                 &event, &err)) {
                printf("XInput extension not available.\n");
                return FALSE;
            }

            // Ensure XInput extension is version 2.0
            int major = 2, minor = 0;
            if (XIQueryVersion(x11Display, &major, &minor) == BadRequest) {
                printf("XInput version %d.%d is not supported.\n", major, minor);
                return FALSE;
            }
            */

            // Initialize EGL
            //setenv("EGL_PLATFORM", "x11", TRUE);                // Mesa hack
            _eglDisplay = eglGetDisplay(xDisplay)
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

            // TODO Listen for changes to device hierarchy

            // Attach WindowSource for receiving events
            windowsrc : soy._WindowSource*
            windowsrc = new soy._WindowSource(self)
            ((Source) windowsrc).attach(soy._client_thread.context)

        // Open a new window if needed
        if _xWindow is null

            // Get default colormap
            screen : unowned X.Screen = xDisplay.default_screen()
            winattr.colormap = screen.default_colormap_of_screen()

            // Since we're using XI2 we only care about these two events
            winattr.event_mask = (X.EventMask.ExposureMask |
                                  X.EventMask.StructureNotifyMask |
                                  X.EventMask.KeyPressMask |
                                  X.EventMask.KeyReleaseMask |
                                  X.EventMask.ButtonPressMask |
                                  X.EventMask.ButtonReleaseMask |
                                  X.EventMask.PointerMotionMask)

            // TODO add window fullscreen and borderless modes
            //if fullScreen || borderless
            //    winattr.override_redirect = 1;
            winattr.override_redirect = false
            _xWindow = xDisplay.create_window(
                xDisplay.default_root_window(),                // parent
                0,                                              // x
                0,                                              // y
                1023,                                           // width
                768,                                            // height
                0,                                              // border_width
                _xVisInfo.depth,                                // depth
                X.WindowClass.INPUT_OUTPUT,                     // class
                _xVisInfo.visual,                               // visual
                (X.CW.Colormap |                                // valuemask
                 X.CW.EventMask |
                 X.CW.OverrideRedirect),
                ref winattr                                     // attributes
            )
            _window.windowid = (uint) _xWindow

        return true

    def window_client (event : X.ClientMessageEvent)
        if event.l[0] == _wm_delete_window
            // Signal interested parties
            on_close()
            
            // Tell background thread to close
            closing = true

    def window_config (event : X.ConfigureEvent)
        // Ignore if not our window
        if event.window != _xWindow
            return

        /* Fired if:
         *  Window size, border, position or stacking order reconfigured
         *  Window moved
         *  Window remapped
         *  If override-redirect flag is false
         */
        window.position.set(event.x, event.y, 0.0f)
        window.size.set(event.width, event.height, 0.0f)

        // Clear the resized flag so that XResizeWindow isn't called leading to
        // a ConfigureNotify event loop.
        window.resized = false


    def window_draw (event : X.ExposeEvent)
        // Ignore if not our window
        if event.window != _xWindow
            return

        // Ensure window has been created first
        if _eglSurface is null
            return

        // Activate window
        eglMakeCurrent(_eglDisplay, _eglSurface, _eglSurface, _eglContext)

        // Draw window
        window.draw()

        // Push color buffer to window
        eglSwapBuffers(_eglDisplay, _eglSurface)


    def window_opened (event : X.CreateWindowEvent)
        // Ignore if not our window
        if event.window != _xWindow
            return

        // Map new window
        xDisplay.map_window(_xWindow)

        // Enable window close notify
        _wm_delete_window = xDisplay.intern_atom("WM_DELETE_WINDOW", false)
        xDisplay.set_wm_protocols(_xWindow, {_wm_delete_window})

        // Get EGLSurface
        _eglSurface = eglCreateWindowSurface(_eglDisplay,
                                             _eglConfig,
                                             _xWindow,
                                             null)

        // Finish with a flush
        xDisplay.flush()


    def window_resize (size : soy.atoms.Size)
        return

