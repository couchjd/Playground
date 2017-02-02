#!/usr/bin/env python3

import soy
from math import sin, cos
from time import sleep

mat = soy.materials.Colored('black')
world = soy.scenes.Planar(material=mat)
world['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 10, 15)))
world['cam'].rotation = soy.atoms.Rotation((0, 0, .5))
world['light'] = soy.bodies.Light(soy.atoms.Position((0, 5, 0)))
world['light'].texture = soy.textures.Texture('checkered', (soy.atoms.Color('green'),soy.atoms.Color('green')))
world['light'].diffuse = soy.atoms.Color('green')
world['light'].specular = soy.atoms.Color('green')
world['light2'] = soy.bodies.Light(soy.atoms.Position((0, 8, 0)))
world['light2'].texture = soy.textures.Texture('checkered', (soy.atoms.Color('blue'),soy.atoms.Color('blue')))
world['light2'].diffuse = soy.atoms.Color('blue')
world['light2'].specular = soy.atoms.Color('blue')
world['light3'] = soy.bodies.Light(soy.atoms.Position((0, 8, 0)))
world['light3'].texture = soy.textures.Texture('checkered', (soy.atoms.Color('red'),soy.atoms.Color('red')))
world['light3'].diffuse = soy.atoms.Color('red')
world['light3'].specular = soy.atoms.Color('red')
world.scale = 2

world['cube2'] = soy.bodies.Box(soy.atoms.Position((0, 0.25, 0)),
    material=soy.materials.Colored('white'))
world['cube2'].size = soy.atoms.Size((5, 0.5, 5))


client = soy.Client()
client.window.append(soy.widgets.Projector(world['cam']))
time = 0
if __name__ == '__main__' :
    while client.window :
        world['light'].position.x = 5*cos(time)
        world['light'].position.z = 5*sin(time)
        world['light2'].position.x = 3*sin(time)
        world['light2'].position.y = 5 + 3*cos(time)
        world['light3'].position.y = 6 + 4*sin(time)
        world['light3'].position.z = 4*cos(time)
        time += 0.01
        sleep(.01)
