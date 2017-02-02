/*
 *  libsoy - soy.Client for VideoCore
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
    VideoCore


class soy.Client : Object
    event on_close ()

    prop readonly address : string

    prop readonly window : soy.widgets.Window

    closing : bool
    display : DisplayManager.Display
    eglWindow : DisplayManager.EGLWindow
    _eglConfig : EGLConfig
    _eglContext : EGLContext
    _eglDisplay : EGLDisplay
    _eglSurface : EGLSurface


    init
        // Set empty address
        _address = ""

        // Create new window
        _window = new soy.widgets.Window()

        // Get a hook for the new window's size
        //TODO _window_size.on_set.connect(self.window_resize)

        // Launch background thread if it hasn't already
        if soy._client_thread is null
            soy._client_thread = new soy._ClientThread()

        // Add event source to be called every 25ms (40fps)
        var source = new TimeoutSource(25)
        source.set_callback(thread_step)
        source.attach(soy._client_thread.context)


    //final
        // Wait until background thread has finished
        //while xDisplay is not null
        //    Thread.usleep(10)

    def init_videocore () : bool
        screen : int = 0 // This needs to be auto-detected/configurable
        width : int
        height : int
        update : DisplayManager.Update

        // Initialize Broadcom GPU
        bcm_host_init()

        // create an EGL window surface, passing context width/height
        if graphics_get_display_size(screen,
                                     out width,
                                     out height) < 0
            return false // TODO raise?

        dst_rect : Rect = {0, 0, width, height}
        src_rect : Rect = {0, 0, width<<16, height<<16}

        self.display = DisplayManager.Display(screen)
        update = DisplayManager.Update(0)
        eglWindow.element = DisplayManager.Element(update, self.display,
                                                   0, ref dst_rect,
                                                   0, ref src_rect,
                                                   0, null, null, 0)

        // sync
        update.submit_sync()

        // set eglWindow size
        eglWindow.width = width
        eglWindow.height = height

        // set soy.widgets.Window size
        _window.size.width = width
        _window.size.height = height

        // successfully initialized videocore
        return true


    def init_egl () : bool
        major : int
        minor : int
        matches : int

        // Get eglDisplay
        _eglDisplay = eglGetDisplay(EGL_DEFAULT_DISPLAY)
        if _eglDisplay == EGL_NO_DISPLAY
            print "Could not acquire EGL display."
            return false // TODO raise?

        // Initialize EGL
        if !eglInitialize(_eglDisplay, out major, out minor)
            print "EGL appears to be broken on this system."
            return false // raise(15)

        // Check EGL version
        if major != 1 || minor < 3
            print "EGL version %d.%d not supported.\n", major, minor
            return false // raise(15)

        // Required EGL attributes
        attrs : array of EGLint = {
            EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,    // OpenGL ES 2.0
            EGL_DEPTH_SIZE, 16,                         // Depth
            EGL_NONE
        }

        ctx_attrs : array of EGLint = {
            EGL_CONTEXT_CLIENT_VERSION, 2,              // OpenGL ES 2.0
            EGL_NONE
        }

        // Choose sanest EGL configuration
        configs : array of EGLConfig = {_eglConfig}
        if (!eglChooseConfig(_eglDisplay, attrs, configs,
                             out matches) or matches == 0)
            print "EGL configuration failed."
            return false // raise(15);
        _eglConfig = configs[0]

        eglBindAPI(EGL_OPENGL_ES_API)

        // Get eglContext
        _eglContext = eglCreateContext(_eglDisplay, _eglConfig,
                                       EGL_NO_CONTEXT, ctx_attrs)
        if _eglContext == EGL_NO_CONTEXT
            print "Could not create EGL context"
            return false

        // get eglSurface
        _eglSurface = eglCreateWindowSurface(_eglDisplay,
                                             _eglConfig,
                                             (EGLNativeWindowType)
                                             (&self.eglWindow), null)
        if _eglSurface == EGL_NO_SURFACE
            print "Could not create EGL window surface"
            return false

        // successfully initialized EGL
        return true


    def thread_step () : bool
        // If window has been closed, stop rendering
        if closing
            return false

        //
        // If window is not open yet, do so now
        if _eglSurface == EGL_NO_SURFACE
            if !init_videocore()
                print "Failed to initialize VideoCore"
                return false

            if !init_egl()
                print "Failed to initialize EGL"
                return false

        //
        // Activate window
        eglMakeCurrent(_eglDisplay, _eglSurface, _eglSurface, _eglContext)

        // Draw frame
        _window.draw()

        // Push color buffer to window
        eglSwapBuffers(_eglDisplay, _eglSurface)

        return true

