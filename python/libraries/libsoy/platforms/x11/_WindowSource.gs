/*
 *  libsoy - soy._WindowSource for X11
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


class soy._WindowSource : Source
    client : weak soy.Client?

    // soy.controllers
    Keyboard : soy.controllers.Keyboard
    Pointer : soy.controllers.Pointer
    is_repeated : bool

    construct (c : soy.Client)
        client = c
        Keyboard = new soy.controllers.Keyboard()
        Pointer = new soy.controllers.Pointer()

    def override prepare (out timeout_ : int) : bool
        // Before a poll is called, this is called to see if an event is ready.
        // If not, it'll poll for 10ms before checking again.

        if client is null or client.xDisplay.pending() > 0 or client.closing
            timeout_ = 0
            return true

        timeout_ = 10
        return false

    def override check () : bool
        return client is null or client.xDisplay.pending() > 0 or client.closing

    // This is called when there are pending events to be processed.
    def override dispatch (cb : SourceFunc) : bool
        event : X.Event

        if client is null
            return false

        // If window has been closed, stop rendering
        if client.closing
            return false

        while client.xDisplay.pending() > 0
            // Get event
            client.xDisplay.next_event(out event)

            case event.type

                when X.EventType.Expose
                    client.window_draw(event.xexpose)

                when X.EventType.ConfigureNotify
                    client.window_config(event.xconfigure)

                when X.EventType.CreateNotify
                    client.window_opened(event.xcreatewindow)

                when X.EventType.ClientMessage
                    client.window_client(event.xclient)

                when X.EventType.KeyPress
                    Keyboard.key_press(new soy.events.KeyPress(event.xkey.keycode, Keyboard))

                when X.EventType.KeyRelease

                    // Check if auto repeating
                    is_repeated = false
                    if (client.xDisplay.events_queued(1) != 0)
                        nev : X.Event
                        client.xDisplay.peek_event(out nev)

                        if (nev.type == X.EventType.KeyPress) && (nev.xkey.time == event.xkey.time)
                            if (nev.xkey.keycode == event.xkey.keycode)
                                client.xDisplay.next_event(out event)
                                is_repeated = true

                    // If not auto repeating
                    if(!is_repeated)
                        Keyboard.key_release(new soy.events.KeyRelease(event.xkey.keycode, Keyboard))

                when X.EventType.MotionNotify
                    Pointer.onMotion(new soy.events.Motion(event.xbutton.x, event.xbutton.y, event.xbutton.x_root, event.xbutton.y_root, Pointer))

                when X.EventType.ButtonPress
                    Pointer.button_press(new soy.events.ButtonPress(event.xbutton.button, Pointer))

                when X.EventType.ButtonRelease
                    Pointer.button_release(new soy.events.ButtonRelease(event.xbutton.button, Pointer))

                default
                    // ... except for debugging
                    print "Unknown event %d received", event.type

        return true
