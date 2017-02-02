#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()
room = soy.scenes.Room(5)

client.window.title = "All in one"

room['cam'] = soy.bodies.Camera((0,0,17))
client.window.append(soy.widgets.Projector(room['cam']))
room['light'] = soy.bodies.Light((0, 0, 10))


def step1():
	for color in ('gold', 'silver', 'bronze', 'copper') :
	    room[color+'cube'] = soy.bodies.Box(material=soy.materials.Colored(color))

def step2():
	room['svgcube'] = soy.bodies.Box((0,0,0),(2,2,2))

	svgtex = soy.textures.Texture('<svg width="300" height="300"> \
	   <rect width="300" height="300" style="stroke: none; fill: #ffffff"/> \
	   <circle cx="80" cy="90" r="60" style="stroke: none; fill: #0000ff"/> \
	   <circle cx="230" cy="70" r="50" style="stroke: none; fill: #ff00ff"/> \
	   <circle cx="150" cy="220" r="70" style="stroke: none; fill: #ff0000"/> \
	</svg>')

	room['svgcube'].material = soy.materials.Textured(colormap=svgtex)
	room['svgcube'].addTorque(50,100,150)
	room['svgcube'].radius = 0.1

def step3():
	room['smoothcube'] = soy.bodies.Box()
	room['smoothcube'].material = soy.materials.Colored('firebrick')
	room['smoothcube'].size = soy.atoms.Size((1.5, 1.5,1.5))
	room['smoothcube'].radius = 0.4

def step4():
	room['sphere'] = soy.bodies.Sphere()
	room['sphere'].radius = 1.0
	room['sphere'].position = soy.atoms.Position((1, 0, 0))
	room['sphere'].material = soy.materials.Textured()
	room['sphere'].material.colormap = soy.textures.Cubemap("checkered",
                               [soy.atoms.Color('gold'), soy.atoms.Color('firebrick')], 1,1,1)

def step5():
	cubemap = soy.textures.Cubemap("checkered",
		                       [soy.atoms.Color('firebrick'), soy.atoms.Color('goldenrod')])
	cubemap2 = soy.textures.Cubemap("checkered",
		                        [soy.atoms.Color('deeppink'), soy.atoms.Color('darkslategrey')])

	room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
		                       material=soy.materials.Textured())
	room['cube1'].material.colormap = cubemap
	room['cube1'].addTorque(0.05, 0.10, 0.03)
	room['cube1'].addForce(0.05, 0, 0)
	room['cube1'].radius = 0.1

	room['cube2'] = soy.bodies.Box(soy.atoms.Position((3, -0.25, 0)),
		                       material=soy.materials.Textured())
	room['cube2'].material.colormap = cubemap2
	room['cube2'].addTorque(0.03, -0.08, -0.05)
	room['cube2'].addForce(-0.05, 0, 0)
	room['cube2'].size = soy.atoms.Size((1.5, 1.5, 1.5))
	room['cube2'].radius = 0.1

	j = soy.joints.Fixed(room['cube1'],room['cube2'],material=soy.materials.Textured())
	j.material.colormap = cubemap2

def step6():
    skybox = soy.textures.Cubemap("checkered")
    room.skybox = skybox


if __name__ == '__main__' :
	step3()
	step2()
	step1()
	step4()
	step5()
	step6()
	while client.window :
		sleep(.1)
