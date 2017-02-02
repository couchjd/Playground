import parser1
from player import *
from rooms import *
from character import *

def main():
    player1 = Player()
    currRoom = Room(0, 0)
    enemy = HostileNpc()
    npc = Npc()
    command = {}
    
    while True:
        player1.displayStats()
        currRoom.roomDesc(player1.pos[0], player1.pos[1])
        print("Enemy HP: %d/%d" % (enemy.currHP, enemy.maxHP))
        print("NPC HP: %d/%d" % (npc.currHP, npc.maxHP))
        command = parser1.getInput()
        print("Command = ", command['verb'], command['article'])
                                        
        if command['verb'] == 'hit':
            player1.hit(enemy)
                
        if command['verb'] == 'quit' or command['verb'] == 'q':
            break

        if((command['verb'] == 'n') or (command['verb'] == 's') or
           (command['verb'] == 'e') or (command['verb'] == 'w')):
            player1.move(command['verb'])
                
main()
