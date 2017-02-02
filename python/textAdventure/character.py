from random import randrange

class Character(object):
    def __init__(self):
        self.setHP()
        self.pos = [randrange(0,10), randrange(0,10)]
        target = None
            
    def setHP(self):
        self.maxHP = randrange(20, 50)
        self.currHP = self.maxHP

    def move(self, direction):
        if direction == 'n':
            self.pos[1] += 1
        if direction == 's':
            self.pos[1] -= 1
        if direction == 'e':
            self.pos[0] += 1
        if direction == 'w':
            self.pos[0] -= 1

    def hit(self, target):
        target.currHP -= randrange(1, 5)
            
class Npc(Character):
    def __init__(self):
        self.name = "NPC"
        super(Npc, self).__init__()
            
class FriendlyNpc(Npc):
    def __init__(self):
        self.friendly = True
        self.name = "Friend"
        super(FriendlyNpc, self).__init__()

class HostileNpc(Npc):
    def __init__(self):
        self.friendly = False
        self.name = "Enemy"
        super(HostileNpc, self).__init__()
