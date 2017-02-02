import random

class Card(object):
    def __init__(self, designator):
        self.values = {'AH':1, 'AC':1, 'AD':1, 'AS':1, '2H':2, '2C':2, '2D':2, '2S':2,
                      '3H':3, '3C':3, '3D':3, '3S':3, '4H':4, '4C':4, '4D':4, '4S':4,
                      '5H':5, '5C':5, '5D':5, '5S':5, '6H':6, '6C':6, '6D':6, '6S':6,
                      '7H':7, '7C':7, '7D':7, '7S':7, '8H':8, '8C':8, '8D':8, '8S':8,
                      '9H':9, '9C':9, '9D':9, '9S':9, '10H':10, '10C':10, '10D':10, '10S':10,
                      'JH':10, 'JC':10, 'JD':10, 'JS':10, 'QH':10, 'QC':10, 'QD':10, 'QS':10,
                      'KH':10, 'KC':10, 'KD':10, 'KS':10}
        self.value = self.values[designator]
        self.designator = designator

def shuffle():
    deck = []
    for x in range(1, 52):
        deck.append(random.randint(1, 52))
    for x in deck:
        count = 0
        for y in range(len(deck)):
            if x == deck[y]:
                count += 1
                if count > 1:
                    deck[y] = random.randint(1, 52)             
    return deck
    
def assign(deck):
    shuffled = []
    suits = {1:'AH', 2:'2H', 3:'3H', 4:'4H', 5:'5H', 6:'6H', 7:'7H', 8:'8H', 9:'9H', 10:'10H', 11:'JH', 12:'QH', 13:'KH',
             14:'AC', 15:'2C', 16:'3C', 17:'4C', 18:'5C', 19:'6C', 20:'7C', 21:'8C', 22:'9C', 23:'10C', 24:'JC', 25:'QC', 26:'KC',
             27:'AD', 28:'2D', 29:'3D', 30:'4D', 31:'5D', 32:'6D', 33:'7D', 34:'8D', 35:'9D', 36:'10D', 37:'JD', 38:'QD', 39:'KD',
             40:'AS', 41:'2S', 42:'3S', 43:'4S', 44:'5S', 45:'6S', 46:'7S', 47:'8S', 48:'9S', 49:'10S', 50:'JS', 51:'QS', 52:'KS'}

    for x in deck:
        shuffled.append(suits[x])
    return shuffled

def deal(deck):
    dealer, player = [], []
    for x in range(0, 2):
        player.append(Card(deck.pop()))
        dealer.append(Card(deck.pop()))
    print('%s %s' % (dealer[1].designator, dealer[1].value))
    print('%s %s %s %s %d' % (player[0].designator, player[0].value,
                           player[1].designator, player[1].value, score(player)))    
    return player, dealer

def hit(hand, deck):
    hand.append(Card(deck.pop()))
    return hand

def score(hand):
    total, count = 0, 0
    for x in hand:
        total += hand[count].value
        count += 1
    if total > 21:
        return 'bust'
    else:
        return total

def displayHand(hand):
    count = 0
    for x in hand:
        print('%s %s ' % (hand[count].designator, hand[count].value), end='')
        count += 1        

def main():
    deck = assign(shuffle())
    player, dealer = deal(deck)
    player = hit(player, deck)
    displayHand(player)
    print(score(player))
main()
