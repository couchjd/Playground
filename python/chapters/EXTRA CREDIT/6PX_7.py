#7 Odd/Even Counter
from random import randrange

def oddEven():
    odd, even = 0, 0
    for x in range(0, 100):
        number = randrange(0, 100)  #generates 100 random numbers in the range
                                    #0-100
        if number % 2 == 0:         #checks if number is even and increments
            even += 1               #odd counter if it is
        elif number % 2 != 0:       #checks if number is odd and increments
            odd += 1                #odd counter if it is

    return even, odd

def main():
    even, odd = oddEven()
    print("Even: %d\nOdd: %d" % (even, odd))
    
main()
