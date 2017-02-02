#!/usr/bin/env python3

import soy
from time import sleep
from math import sqrt

client = soy.Client()
room = soy.scenes.Room(8)

room['cam'] = soy.bodies.Camera((0,0,5))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((0, 0, 5))

m1 = soy.materials.Colored("red")
m2 = soy.materials.Colored("green")
m3 = soy.materials.Colored("blue")
m4 = soy.materials.Colored("yellow")

a = 1/sqrt(3)
b = sqrt(2/3)
z = 1/sqrt(2)

v1 = soy.atoms.Vertex(soy.atoms.Position((1,0,-z)),soy.atoms.Vector((a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v2 = soy.atoms.Vertex(soy.atoms.Position((0,1,z)),soy.atoms.Vector((a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v3 = soy.atoms.Vertex(soy.atoms.Position((0,-1,z)),soy.atoms.Vector((a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))

v4 = soy.atoms.Vertex(soy.atoms.Position((-1,0,-z)),soy.atoms.Vector((-a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v5 = soy.atoms.Vertex(soy.atoms.Position((0,-1,z)),soy.atoms.Vector((-a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v6 = soy.atoms.Vertex(soy.atoms.Position((0,1,z)),soy.atoms.Vector((-a,0,b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))

v7 = soy.atoms.Vertex(soy.atoms.Position((1,0,-z)),soy.atoms.Vector((0,a,-b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v8 = soy.atoms.Vertex(soy.atoms.Position((-1,0,-z)),soy.atoms.Vector((0,a,-b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v9 = soy.atoms.Vertex(soy.atoms.Position((0,1,z)),soy.atoms.Vector((0,a,-b)),
                      soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))

v10 = soy.atoms.Vertex(soy.atoms.Position((1,0,-z)),soy.atoms.Vector((0,-a,-b)),
                       soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v11 = soy.atoms.Vertex(soy.atoms.Position((0,-1,z)),soy.atoms.Vector((0,-a,-b)),
                       soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))
v12 = soy.atoms.Vertex(soy.atoms.Position((-1,0,-z)),soy.atoms.Vector((0,-a,-b))
                      ,soy.atoms.Position((0,0)),soy.atoms.Vector((1,0,0)))

f1 = soy.atoms.Face(v1,v2,v3,m1)
f2 = soy.atoms.Face(v4,v5,v6,m2)
f3 = soy.atoms.Face(v7,v8,v9,m3)
f4 = soy.atoms.Face(v10,v11,v12,m4)

room['mesh'] = soy.bodies.Mesh()
room['mesh'].append(f1)
room['mesh'].append(f2)
room['mesh'].append(f3)
room['mesh'].append(f4)

room['mesh'].addTorque(30,30,5)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
