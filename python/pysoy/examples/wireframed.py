#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Room(5.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 10)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))
room['cam2'] = soy.bodies.Camera(soy.atoms.Position((10, 10, 10)))

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))
#client.window.append(soy.widgets.Projector(room['cam2']))

room['cube'] = soy.bodies.Box()
room['cube'].material = soy.materials.Wireframed()
room['cube'].addTorque(40, 40, 40)
room['cube'].radius = 0.1
room['cube'].size = soy.atoms.Size((2,2,2))
room['cube'].position = soy.atoms.Position((-2, 2, 0))

room['sphere'] = soy.bodies.Sphere()
room['sphere'].material = soy.materials.Wireframed()
room['sphere'].radius = 1.0
room['sphere'].addTorque(30,30,5)
room['sphere'].position = soy.atoms.Position((2, 2, 0))

cubemap = soy.textures.Cubemap("checkered", [soy.atoms.Color('firebrick'),
                               soy.atoms.Color('goldenrod')])

room['cube2'] = soy.bodies.Box()
room['cube2'].material = soy.materials.Textured(colormap=cubemap)
room['cube2'].addTorque(40, 40, 40)
room['cube2'].radius = 0.1
room['cube2'].size = soy.atoms.Size((2,2,2))
room['cube2'].position = soy.atoms.Position((-2, -2, 0))

room['sphere2'] = soy.bodies.Sphere()
room['sphere2'].material = soy.materials.Textured(colormap=cubemap)
room['sphere2'].radius = 1.0
room['sphere2'].addTorque(30,30,5)
room['sphere2'].position = soy.atoms.Position((2, -2, 0))

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
