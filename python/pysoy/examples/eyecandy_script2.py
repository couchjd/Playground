#!/usr/bin/env python3
import soy

world = soy.scenes.Room(10)
world.walls = soy.materials.Colored('#333')
world.gravity = soy.atoms.Vector((0,0,-100))
world['cam'] = soy.bodies.Camera(soy.atoms.Position((0, -18, 5)))
world['cam'].rotation = soy.atoms.Rotation((0, 0, -0.9))
world['light'] = soy.bodies.Light(soy.atoms.Position((0, 0, 20)))
client = soy.Client()
client.window.append(soy.widgets.Projector(world['cam']))

world['table'] = soy.bodies.Box()
world['table'].size = soy.atoms.Size((7, 14, 2.2))
world['table'].position = soy.atoms.Position((0, 0, -8.9))
world['table'].material = soy.materials.Colored('darkgreen')

world['tableleg1'] = soy.bodies.Box()
world['tableleg1'].size = soy.atoms.Size((0.2, 14, 2.7))
world['tableleg1'].position = soy.atoms.Position((-3.6, 0, -8.65))

world['tableleg2'] = soy.bodies.Box()
world['tableleg2'].size = soy.atoms.Size((0.2, 14, 2.7))
world['tableleg2'].position = soy.atoms.Position((+3.6, 0, -8.65))

world['tableleg3'] = soy.bodies.Box()
world['tableleg3'].size = soy.atoms.Size((7.4, 0.2, 2.7))
world['tableleg3'].position = soy.atoms.Position((0, -7.1, -8.65))

world['tableleg4'] = soy.bodies.Box()
world['tableleg4'].size = soy.atoms.Size((7.4, 0.2, 2.7))
world['tableleg4'].position = soy.atoms.Position((-0, 7.1, -8.65))

world['hole'] = soy.bodies.Cylinder()
world['hole'].radius = 0.4
world['hole'].length = 0.001
world['hole'].position = soy.atoms.Position((3.1, 6.4, -7.7))
world['hole'].material = soy.materials.Colored('black')

world['hole1'] = soy.bodies.Cylinder()
world['hole1'].radius = 0.4
world['hole1'].length = 0.001
world['hole1'].position = soy.atoms.Position((3.1, -6.4, -7.7))
world['hole1'].material = soy.materials.Colored('black')

world['hole2'] = soy.bodies.Cylinder()
world['hole2'].radius = 0.4
world['hole2'].length = 0.001
world['hole2'].position = soy.atoms.Position((-3.1, 6.4, -7.7))
world['hole2'].material = soy.materials.Colored('black')

world['hole3'] = soy.bodies.Cylinder()
world['hole3'].radius = 0.4
world['hole3'].length = 0.001
world['hole3'].position = soy.atoms.Position((-3.1, -6.4, -7.7))
world['hole3'].material = soy.materials.Colored('black')

world['hole4'] = soy.bodies.Cylinder()
world['hole4'].radius = 0.4
world['hole4'].length = 0.001
world['hole4'].position = soy.atoms.Position((3.1, 0, -7.7))
world['hole4'].material = soy.materials.Colored('black')

world['hole5'] = soy.bodies.Cylinder()
world['hole5'].radius = 0.4
world['hole5'].length = 0.001
world['hole5'].position = soy.atoms.Position((-3.1, 0, -7.7))
world['hole5'].material = soy.materials.Colored('black')

world['stick'] = soy.bodies.Box()
world['stick'].size = soy.atoms.Size((0.15, 5, 0.15))
world['stick'].radius = 0.05
world['stick'].position = soy.atoms.Position((0, -7.1, -7.2))
world['stick'].material = soy.materials.Colored('burlywood')
world['stick'].density = 20

j = soy.joints.Fixed(world['table'],world)
j1 = soy.joints.Fixed(world['tableleg1'],world)
j2 = soy.joints.Fixed(world['tableleg2'],world)
j3 = soy.joints.Fixed(world['tableleg3'],world)
j4 = soy.joints.Fixed(world['tableleg4'],world)
j5 = soy.joints.Fixed(world['hole'],world)
j6 = soy.joints.Fixed(world['hole1'],world)
j7 = soy.joints.Fixed(world['hole2'],world)
j8 = soy.joints.Fixed(world['hole3'],world)
j9 = soy.joints.Fixed(world['hole4'],world)
j10 = soy.joints.Fixed(world['hole5'],world)

#white
world['ball'] = soy.bodies.Sphere()
world['ball'].radius = 0.2
world['ball'].position = soy.atoms.Position((0, -4, -7.7))
world['ball'].density = 20
#world['ball'].addForce(0, 300, 0)

#others
world['ball1'] = soy.bodies.Sphere()
world['ball1'].radius = 0.2
world['ball1'].position = soy.atoms.Position((0, 3.5, -7.7))
world['ball1'].material = soy.materials.Colored('yellow')
world['ball1'].density = 10

world['ball2'] = soy.bodies.Sphere()
world['ball2'].radius = 0.2
world['ball2'].position = soy.atoms.Position((0.2, 4, -7.7))
world['ball2'].material = soy.materials.Colored('blue')
world['ball2'].density = 10

world['ball3'] = soy.bodies.Sphere()
world['ball3'].radius = 0.2
world['ball3'].position = soy.atoms.Position((-0.2, 4, -7.7))
world['ball3'].material = soy.materials.Colored('darkred')
world['ball3'].density = 10

world['ball4'] = soy.bodies.Sphere()
world['ball4'].radius = 0.2
world['ball4'].position = soy.atoms.Position((0, 4.5, -7.7))
world['ball4'].material = soy.materials.Colored('black')
world['ball4'].density = 10

world['ball5'] = soy.bodies.Sphere()
world['ball5'].radius = 0.2
world['ball5'].position = soy.atoms.Position((0.4, 4.5, -7.7))
world['ball5'].material = soy.materials.Colored('gold')
world['ball5'].density = 10

world['ball6'] = soy.bodies.Sphere()
world['ball6'].radius = 0.2
world['ball6'].position = soy.atoms.Position((-0.4, 4.5, -7.7))
world['ball6'].material = soy.materials.Colored('magenta')
world['ball6'].density = 10

world['ball7'] = soy.bodies.Sphere()
world['ball7'].radius = 0.2
world['ball7'].position = soy.atoms.Position((-0.2, 5, -7.7))
world['ball7'].material = soy.materials.Colored('darkblue')
world['ball7'].density = 10

world['ball8'] = soy.bodies.Sphere()
world['ball8'].radius = 0.2
world['ball8'].position = soy.atoms.Position((0.2, 5, -7.7))
world['ball8'].material = soy.materials.Colored('red')
world['ball8'].density = 10

world['ball9'] = soy.bodies.Sphere()
world['ball9'].radius = 0.2
world['ball9'].position = soy.atoms.Position((-0.6, 5, -7.7))
world['ball9'].material = soy.materials.Colored('green')
world['ball9'].density = 10

world['ball10'] = soy.bodies.Sphere()
world['ball10'].radius = 0.2
world['ball10'].position = soy.atoms.Position((0.6, 5, -7.7))
world['ball10'].material = soy.materials.Colored('darkgreen')
world['ball10'].density = 10

world['ball11'] = soy.bodies.Sphere()
world['ball11'].radius = 0.2
world['ball11'].position = soy.atoms.Position((0, 5.5, -7.7))
world['ball11'].material = soy.materials.Colored('orange')
world['ball11'].density = 10

world['ball12'] = soy.bodies.Sphere()
world['ball12'].radius = 0.2
world['ball12'].position = soy.atoms.Position((0.4, 5.5, -7.7))
world['ball12'].material = soy.materials.Colored('blueviolet')
world['ball12'].density = 10

world['ball13'] = soy.bodies.Sphere()
world['ball13'].radius = 0.2
world['ball13'].position = soy.atoms.Position((-0.4, 5.5, -7.7))
world['ball13'].material = soy.materials.Colored('cornflowerblue')
world['ball13'].density = 10

world['ball14'] = soy.bodies.Sphere()
world['ball14'].radius = 0.2
world['ball14'].position = soy.atoms.Position((0.8, 5.5, -7.7))
world['ball14'].material = soy.materials.Colored('crimson')
world['ball14'].density = 20

world['ball15'] = soy.bodies.Sphere()
world['ball15'].radius = 0.2
world['ball15'].position = soy.atoms.Position((-0.8, 5.5, -7.7))
world['ball15'].material = soy.materials.Colored('darkorange')
world['ball15'].density = 20

world['ballbox1'] = soy.bodies.Box()
world['ballbox1'].size = soy.atoms.Size((0.2, 4.8, 1))
world['ballbox1'].position = soy.atoms.Position((-6, 0, -9.5))

world['ballbox2'] = soy.bodies.Box()
world['ballbox2'].size = soy.atoms.Size((2.4, 0.2, 1))
world['ballbox2'].position = soy.atoms.Position((-3.7-1.2, -2.5, -9.5))

world['ballbox3'] = soy.bodies.Box()
world['ballbox3'].size = soy.atoms.Size((2.4, 0.2, 1))
world['ballbox3'].position = soy.atoms.Position((-3.7-1.2, +2.5, -9.5))

j11 = soy.joints.Fixed(world['ballbox1'],world)
j12 = soy.joints.Fixed(world['ballbox2'],world)
j13 = soy.joints.Fixed(world['ballbox3'],world)

path = (soy.atoms.Position((0, -4, -7.7)),
        soy.atoms.Position((0, 5, -7.7)))

path1 = (soy.atoms.Position((0, -7.1, -7.2)),
        soy.atoms.Position((0, -6, -7.2)),
        soy.atoms.Position((-5, -7, -7.1)))

cont = soy.controllers.Pathfollower(world, world['stick'], path1, 2)

def check_pos(body):
    if abs(3.1-body.position.x) <= 0.6 and abs(6.4-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))
    if abs(3.1-body.position.x) <= 0.6 and abs(-6.4-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))
    if abs(3.1-body.position.x) <= 0.6 and abs(0-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))
    if abs(-3.1-body.position.x) <= 0.6 and abs(6.4-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))
    if abs(-3.1-body.position.x) <= 0.6 and abs(-6.4-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))
    if abs(-3.1-body.position.x) <= 0.6 and abs(0-body.position.y) <= 0.6:
        print("collide")
        body.position = soy.atoms.Position((-5, 0, -9.5))

if __name__ == '__main__' :
    from time import sleep
    while client.window :
        print(world['stick'].position)
        check_pos(world['ball'])
        check_pos(world['ball1'])
        check_pos(world['ball2'])
        check_pos(world['ball3'])
        check_pos(world['ball4'])
        check_pos(world['ball5'])
        check_pos(world['ball6'])
        check_pos(world['ball7'])
        check_pos(world['ball8'])
        check_pos(world['ball9'])
        check_pos(world['ball10'])
        check_pos(world['ball11'])
        check_pos(world['ball12'])
        check_pos(world['ball13'])
        check_pos(world['ball14'])
        check_pos(world['ball15'])

        if world['stick'].position.x <= -4.5:
            joint = soy.joints.Fixed(world['stick'],world)
        sleep(.1)
