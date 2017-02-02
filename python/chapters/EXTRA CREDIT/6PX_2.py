#2 Math Quiz
from random import randrange

def numGen():                       #generates two random numbers and
    num = {}                        #calculates the sum of those two numbers
    num['1'] = int(randrange(0, 1000))
    num['2'] = int(randrange(0, 1000))
    num['sum'] = num['1'] + num['2']
    return num

def getInput(num):                  #gets answer from user
    print("  %d\n+ %d\n" % (num['1'], num['2']), end='')
    num['answer'] = int(input(' '))
    return num

def compare(num):                   #compares user input with actual sum
    if num['answer'] == num['sum']: #and displays corresponding message
        print("That is correct!")
    else:
        print("The correct answer is %d." % num['sum'])

def main():
    compare(getInput(numGen()))
    
main()
