#!/usr/bin/env python3
import soy

mat = soy.materials.Textured(colormap=
        soy.textures.Texture('checkered', (soy.atoms.Color('black'),
                                           soy.atoms.Color('white'))))
mat.colormap.wrap = True

world = soy.scenes.Planar(material=mat)
world['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 3, 20)))
world['light'] = soy.bodies.Light(soy.atoms.Position((0, 5, 20)))
world.gravity = soy.atoms.Vector((0, 0, 0))
client = soy.Client()
client.window.append(soy.widgets.Projector(world['cam']))

world['leg1'] = soy.bodies.Sphere()
world['leg1'].material = soy.materials.Colored('bronze')
world['leg1'].radius = 0.5
world['leg1'].position = soy.atoms.Position((-6, 1, 0))

world['leg2'] = soy.bodies.Sphere()
world['leg2'].material = soy.materials.Colored('bronze')
world['leg2'].radius = 0.5
world['leg2'].position = soy.atoms.Position((2, 1, 0))

world['leg3'] = soy.bodies.Sphere()
world['leg3'].material = soy.materials.Colored('bronze')
world['leg3'].radius = 0.5
world['leg3'].position = soy.atoms.Position((-2, 1, -4))

world['bodypart1'] = soy.bodies.Box()
world['bodypart1'].material = soy.materials.Colored('bronze')
world['bodypart1'].size = soy.atoms.Size((0.5, 1, 0.5))
world['bodypart1'].radius = 0.1
world['bodypart1'].position = soy.atoms.Position((-2, 4, 0))

world['bodypart2'] = soy.bodies.Sphere()
world['bodypart2'].material = soy.materials.Colored('copper')
world['bodypart2'].radius = 1.5
world['bodypart2'].position = soy.atoms.Position((-2, 6, 1))

joint1 = soy.joints.Ball(world['leg1'], world['bodypart1'], 
                         soy.atoms.Position((world['bodypart1'].position.x-2, 
                            world['leg1'].position.y+2, world['leg1'].position.z)),
                         soy.materials.Colored('bronze'))

joint2 = soy.joints.Ball(world['leg2'], world['bodypart1'], 
                         soy.atoms.Position((world['bodypart1'].position.x+2, 
                            world['leg2'].position.y+2, world['leg2'].position.z)),
                         soy.materials.Colored('bronze'))

joint3 = soy.joints.Ball(world['leg3'], world['bodypart1'], 
                         soy.atoms.Position((world['bodypart1'].position.x, 
                            world['leg3'].position.y+2, world['leg3'].position.z+2)),
                         soy.materials.Colored('bronze'))

joint4 = soy.joints.Fixed(world['bodypart1'], world['bodypart2'], soy.materials.Colored('bronze'))


path = (soy.atoms.Position((-6, 1, 0)),
        soy.atoms.Position((-5, 2, 1)),
        soy.atoms.Position((-4.5, 1, 1.5)),
        soy.atoms.Position((-3.5, 2, 2.5)),
        soy.atoms.Position((-3, 1, 3)))

path2 = (soy.atoms.Position((2, 1, 0)),
        soy.atoms.Position((3, 2, 1)),
        soy.atoms.Position((3.5, 1, 1.5)),
        soy.atoms.Position((4.5, 2, 2.5)),
        soy.atoms.Position((5, 1, 2.5)),
        soy.atoms.Position((4.5, 3, 2.5)),
        soy.atoms.Position((3.5, 3.5, 2.5)))

path3 = (soy.atoms.Position((-2, 1, -4)),
        soy.atoms.Position((-1, 2, -3)),
        soy.atoms.Position((-0.5, 1, -2.5)),
        soy.atoms.Position((0.5, 2, -1.5)),
        soy.atoms.Position((1, 1, -1)))

path4 = (soy.atoms.Position((-2, 6, 0)),
        soy.atoms.Position((-1, 6, 1)),
        soy.atoms.Position((-0.5, 6, 1.5)),
        soy.atoms.Position((0.5, 6, 2.5)),
        soy.atoms.Position((1, 6, 3)),
        soy.atoms.Position((1, 5, 3)),
        soy.atoms.Position((1, 6, 3)))

cont1 = soy.controllers.Pathfollower(world, world['leg1'], path, 0.5)
cont2 = soy.controllers.Pathfollower(world, world['leg2'], path2, 0.5)
cont3 = soy.controllers.Pathfollower(world, world['leg3'], path3, 0.5)
cont4 = soy.controllers.Pathfollower(world, world['bodypart2'], path4, 0.5)

if __name__ == '__main__' :
    from time import sleep

    while client.window :
        sleep(.1)
