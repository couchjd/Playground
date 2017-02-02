#!/usr/bin/env python3

import soy
from math import sin, cos, pi
from time import sleep

room = soy.scenes.Scene()
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 10)))
room['light'] = soy.bodies.Light(soy.atoms.Position((0, 4, 1)))
room['light'].diffuse = soy.atoms.Color('green')
room['light'].specular = soy.atoms.Color('green')
room['light2'] = soy.bodies.Light(soy.atoms.Position((0, 0, 1)))
room['light2'].diffuse = soy.atoms.Color('blue')
room['light2'].specular = soy.atoms.Color('blue')
room['light3'] = soy.bodies.Light(soy.atoms.Position((0, -4, 1)))
room['light3'].diffuse = soy.atoms.Color('red')
room['light3'].specular = soy.atoms.Color('red')
client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

firebrick = soy.atoms.Color('firebrick')
goldenrod = soy.atoms.Color('goldenrod')

material = soy.materials.Textured()
material.bumpmap = soy.textures.Bumpmap("media/normal_map.png")
material.colormap = soy.textures.Texture("checkered",
										[firebrick, goldenrod])

room['board'] = soy.bodies.Billboard()
room['board'].material = material
room['board'].size = soy.atoms.Size((8,8,0))

time = 0

if __name__ == '__main__' :
    while client.window :
        room['light'].position.x = 5*cos(time)
        room['light2'].position.x = 5*cos(time+2*pi/3)
        room['light3'].position.x = 5*cos(time+4*pi/3)
        time += 0.01
        sleep(.01)
