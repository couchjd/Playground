#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()
room = soy.scenes.Room(8)

room['cam'] = soy.bodies.Camera((0,0,5))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((-2, 3, 5))

tex = soy.textures.Texture('<svg width="400" height="400"> \
   <rect width="400" height="400" style="stroke: none; fill: #ffffff"/> \
   <rect x="0" y="150" width="100" height="100" style="stroke: none; fill: #ff0000"/> \
   <rect x="100" y="150" width="100" height="100" style="stroke: none; fill: #ffff00"/> \
   <rect x="200" y="150" width="100" height="100" style="stroke: none; fill: #00ffff"/> \
   <rect x="300" y="150" width="100" height="100" style="stroke: none; fill: #0000ff"/> \
   <rect x="200" y="50" width="100" height="100" style="stroke: none; fill: #00ff00"/> \
   <rect x="200" y="250" width="100" height="100" style="stroke: none; fill: #ff00ff"/> \
</svg>')

room['sphere'] = soy.bodies.Sphere()
room['sphere'].material = soy.materials.Textured(colormap=tex)
room['sphere'].radius = 1.0
room['sphere'].addTorque(30,30,5)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
