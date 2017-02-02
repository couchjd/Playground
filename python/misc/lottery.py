import random
import time

random.seed(time.localtime())

def randGen():
    return int(random.randint(1, 75))

def numGen(plays):
    print('\nYour Lucky Lottery Numbers')
    print('-----------------------------------------------------')

    for x in range(plays):
        numbers = []
        for x in range(5):
            numbers.append(randGen())
        for x in numbers:   #searches for and replaces duplicate values
            count = 0
            for y in range(len(numbers)):
                if x == numbers[y]:
                    count += 1
                    if count > 1:
                        numbers[y] = randGen()
                        #print('Changing %d to %d.' % (x, numbers[y]))
                        
        mega = int(random.randint(1, 15))
                   
        for x in sorted(numbers):
            print('%d\t' % x, end='')
        print('Mega: ', mega)
    print('-----------------------------------------------------')

    while True:
        more = str.lower(input("More numbers? "))
        if more == 'n' or more == 'no':
            return 0
        elif more == 'y' or more == 'yes':
            return 1
        else:
            print("Invalid entry.")
            
def main():
    while True:
        try:
            run = numGen(abs(int(input('Number of plays: '))))
            if run == 0:
                break
        except:
            print("Input a number.")
main()
