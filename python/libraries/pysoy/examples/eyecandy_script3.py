#!/usr/bin/env python3

import soy
from time import sleep
from math import sin, cos, pi

client = soy.Client()
room = soy.scenes.Scene()
room.ambient = soy.atoms.Color((255,255,255))

room['cam'] = soy.bodies.Camera((0,0,0))
client.window.append(soy.widgets.Projector(room['cam']))

firebrick = soy.atoms.Color('firebrick')
goldenrod = soy.atoms.Color('goldenrod')

material = soy.materials.Textured()
material.colormap = soy.textures.Texture("checkered", [firebrick, goldenrod])
material.colormap.wrap = True
material.ambient = soy.atoms.Color((255,255,255))

SIDES = 32
LENGTH = 100

verts = []

for i in range(LENGTH):
    for j in range(SIDES+1):
        verts.append(soy.atoms.Vertex(soy.atoms.Position((1.5*cos(2*pi*j/SIDES)+0.8*cos(2*pi*i/16),
                                      1.5*sin(2*pi*j/SIDES)+0.8*sin(2*pi*i/16),-i)),
                                      soy.atoms.Vector((-cos(2*pi*j/SIDES),-sin(2*pi*j/SIDES),0)),
                                      soy.atoms.Position((8*j/SIDES,i)),
                                      soy.atoms.Vector((-sin(2*pi*j/SIDES),cos(2*pi*j/SIDES),0))))

room['mesh'] = soy.bodies.Mesh()

for i in range(LENGTH-1):
    for j in range(SIDES):
        room['mesh'].append(soy.atoms.Face(verts[j+(SIDES+1)*i],
                                           verts[j+1+(SIDES+1)*i],
                                           verts[j+1+(SIDES+1)*(i+1)],
                                           material))
        room['mesh'].append(soy.atoms.Face(verts[j+(SIDES+1)*(i+1)],
                                           verts[j+(SIDES+1)*i],
                                           verts[j+1+(SIDES+1)*(i+1)],
                                           material))

room['mesh'].addForce(0,0,300)
room['cam'].addTorque(0,0,30)

if __name__ == '__main__' :
    while client.window :
        if room['mesh'].position.z > 16:
            room['mesh'].position.z -= 16
        t = room['mesh'].position.z
        room['cam'].position.x = 0.8*cos(2*pi*t/16)
        room['cam'].position.y = 0.8*sin(2*pi*t/16)
