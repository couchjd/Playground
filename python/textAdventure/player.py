from character import *
from random import randrange

class Player(Character):
    def __init__(self):
        self.pos = [0,0]
        self.stats = {}
        self.initialize()
        self.target = None
            
    def getName(self):
        self.name = input("What is your name? ")
    
    def chooseClass(self):
        while True:
            try:
                classSelect = int(input("Choose a class:\n1. Fighter\n2. Mage\n3. Cleric\nEnter choice: "))
                if classSelect == 1:
                    self.charClass = "Fighter"
                    break
                elif classSelect == 2:
                    self.charClass = "Mage"
                    break
                elif classSelect == 3:
                    self.charClass = "Cleric"
                    break
            except:
                print("Invalid choice.")
                
    def create(self):
        self.getName()
        self.chooseClass()
        self.stats['level'] = 1

    def roll(self):
        rollStats = True
        while rollStats:
            self.rollStr(self.charClass)
            self.rollInt(self.charClass)
            self.rollWis(self.charClass)
            self.rollHP()
            print("Str: %d \nInt: %d\nWis: %d\nHP: %d/%d" %
              (self.stats['str'], self.stats['int'],
               self.stats['wis'], self.currHP, self.maxHP))

            if input("Keep stats? ") == 'y':
                rollStats = False
            else:
                rollStats = True

    def rollStr(self, charClass):
        if charClass == 'Fighter':
            self.stats['str'] = (randrange(10, 17)+5)
        elif charClass == 'Mage':
            self.stats['str'] = (randrange(10, 17)-2)
        elif charClass == 'Cleric':
            self.stats['str'] = (randrange(10, 17)-2)

    def rollInt(self, charClass):
        if charClass == 'Fighter':
            self.stats['int'] = (randrange(10, 17)-2)
        elif charClass == 'Mage':
            self.stats['int'] = (randrange(10, 17)+5)
        elif charClass == 'Cleric':
            self.stats['int'] = (randrange(10, 17))

    def rollWis(self, charClass):
        if charClass == 'Fighter':
            self.stats['wis'] = (randrange(10, 17)-2)
        elif charClass == 'Mage':
            self.stats['wis'] = (randrange(10, 17))
        elif charClass == 'Cleric':
            self.stats['wis'] = (randrange(10, 17)+5)

    def rollHP(self):
        self.maxHP = randrange(20, 50)
        self.currHP = self.maxHP

    def displayStats(self):
        print("%s\n%s\nLevel %d\nStr: %d\nInt: %d\nWis: %d\nHP: %d/%d" %
              (self.name, self.charClass, self.stats['level'],
             self.stats['str'], self.stats['int'],
             self.stats['wis'], self.currHP, self.maxHP)) 

    def initialize(self):
        self.create()
        self.roll()

