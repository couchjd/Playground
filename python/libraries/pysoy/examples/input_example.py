#!/usr/bin/env python3

import soy
import blocks
from time import sleep
from math import sqrt


size=4

# Events init
soy.events.KeyPress.init()
soy.events.KeyRelease.init()

client = soy.Client()
room = soy.scenes.Room(8)

room['cam'] = soy.bodies.Camera((0,0,5))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((3, 3, 8))

white = soy.atoms.Color('white')
green = soy.atoms.Color('green')

cubemap = soy.textures.Cubemap("checkered",
                               [white, green], 1,2,3)

room['cube1'] = soy.bodies.Box(soy.atoms.Position((0, 0, 0)),
                               material=soy.materials.Textured())
room['cube1'].material.colormap = cubemap
room['cube1'].radius = 0.1

room['cube1'].addTorque(2, 2, 4)

Rforce = soy.atoms.Vector((100,0,0))		# Right force
Lforce = soy.atoms.Vector((-100,0,0))		# Left force
Uforce = soy.atoms.Vector((0,100,0))		# Up force
Dforce = soy.atoms.Vector((0, -100, 0))		# Down force
Fforce = soy.atoms.Vector((0,0,-200))		# Forwards force
Bforce = soy.atoms.Vector((0,0, 200))		# Backwards force

# Actions
RThrust = soy.actions.Thrust(room['cube1'], Rforce)
LThrust = soy.actions.Thrust(room['cube1'], Lforce)
UThrust = soy.actions.Thrust(room['cube1'], Uforce)
DThrust = soy.actions.Thrust(room['cube1'], Dforce)
FThrust = soy.actions.Thrust(room['cube1'], Fforce)
BThrust = soy.actions.Thrust(room['cube1'], Bforce)

# Events
soy.events.KeyPress.addAction("Right", RThrust)
soy.events.KeyRelease.addAction("Right", LThrust)
soy.events.KeyPress.addAction("Left", LThrust)
soy.events.KeyRelease.addAction("Left", RThrust)
soy.events.KeyPress.addAction("Up", UThrust)
soy.events.KeyRelease.addAction("Up", DThrust)
soy.events.KeyPress.addAction("Down", DThrust)
soy.events.KeyRelease.addAction("Down", UThrust)
soy.events.KeyPress.addAction("W", FThrust)
soy.events.KeyRelease.addAction("W", BThrust)
soy.events.KeyPress.addAction("S", BThrust)
soy.events.KeyRelease.addAction("S", FThrust)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
