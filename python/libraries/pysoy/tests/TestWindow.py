#!/usr/bin/env python

''' Tests for soy.Client.window
'''
__credits__ = '''
    Copyright (C) 2006-2014 Copyleft Games Group

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
'''
__author__  = 'PySoy Group'
__date__    = 'Last change on '+ \
              '$Date:$'[7:-20]+ \
              'by '+'$Author:$'[9:-2]
__version__ = 'Trunk (r'+'$Rev:$'[6:-2]+')'

import soy
import unittest
import sys

from ctypes import *
from pyxlib_ctypes import * # ctypes Xlib wrapper

from time import sleep

client = soy.Client()

display = XOpenDisplay(None)
if display == 0:
    sys.exit("Cannot open the default display.")

while client.window.__windowid__ == 0:
    # Wait for window initialization
    sleep(.1)

window = client.window.__windowid__

class TestWindow(unittest.TestCase):
    def test_resize(self):
        resize = XResizeWindow(display, window, 320, 240)
        flush = XFlush(display)

        self.assertTrue(resize and flush)

    def test_change_position(self):
        move = XMoveWindow(display, window, 50, 50)
        flush = XFlush(display)

        self.assertTrue(move and flush)

    def test_fullscreen(self):
        e = XEvent()
        e.xclient.type = ClientMessage
        e.xclient.window = window
        e.xclient.message_type = XInternAtom(
            display, b'_NET_WM_STATE', True
        );
        e.xclient.format = 32
        e.xclient.data.l[0] = 2 # _NET_WM_STATE_TOGGLE
        e.xclient.data.l[1] = XInternAtom(
            display, b'_NET_WM_STATE_FULLSCREEN', True
        );
        e.xclient.data.l[2] = 0
        e.xclient.data.l[3] = 1
        e.xclient.data.l[4] = 0

        fullscreen = XSendEvent(
            display,
            XDefaultRootWindow(display),
            False,
            SubstructureRedirectMask | SubstructureNotifyMask,
            e
        )
        flush = XFlush(display)

        self.assertTrue(fullscreen and flush)

def tearDownModule():
    XCloseDisplay(display)

def TestWindowSuite():
    return unittest.TestLoader().loadTestsFromTestCase(TestWindow)

if __name__=='__main__':
    unittest.main()

