#1 Feet to Inches
def get_feet():                     #gets number of feet from user
    feet = int(input("Input number of feet: "))
    return feet

def feet_to_inches(feet):           #receives feet as an argument
    inches = feet*12                #and converts to inches
    return inches

def main():
    print("That is %d inches." % feet_to_inches(get_feet()))

main()

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

#3 Maximum of Two Values
def compare(intOne, intTwo):
    if intOne > intTwo:
        return intOne
    else:
        return intTwo

def main():
    print("%d is the greater value." % 
          compare(int(input("Enter first number: ")),
                  int(input("Enter second number: "))))

main()

#4 Falling Distance
GRAVITY = 9.8

def falling_distance(fallingTime):
    distance = ((1/2)*GRAVITY*fallingTime**2)
    return distance

def main():
    print("Time(sec)\tDistance(feet)")
    print("------------------------------")
    for x in range(1, 11):
        print("%d\t\t%.1f" % (x, falling_distance(x)))

main()

#5 Kinetic Energy
def kinetic_energy(mass, velocity):
    kEnergy = ((1/2)*mass*velocity**2)
    return kEnergy

def main():
    print("The kinetic energy is %.2f joules." %
          kinetic_energy(float(input("Enter mass of object: ")),
                         float(input("Enter velocity of object: "))))

main()

#6 Test Average and Grade
def calc_average(score1, score2, score3, score4, score5):
    #accepts 5 test scores and returns the average score
    average = ((score1 + score2 + score3 + score4 + score5)/5)
    return average

def determine_grade(score):
    #accepts a test score and returns a letter grade value
    if score >= 90 and score <= 100:
        return 'A'
    elif score >= 80 and score <= 89:
        return 'B'
    elif score >= 70 and score <= 79:
        return 'C'
    elif score >= 60 and score <= 69:
        return 'D'
    elif score < 60:
        return 'F'
    else:
        return 'Invalid test score.'

def main():
    score = []
    #get 5 test scores
    for x in range(0, 5):
        score.insert(x, float(input("Score %d: " % int(x+1))))

    print("\nScore\tGrade")
    print("-------------")
    for x in score:
        print("%d\t%s" % (x, determine_grade(x)))   #prints each score and
                                                    #letter grade
    print("----------------")
    print("Average: %.1f%%" % calc_average(score[0], score[1], score[2],
                                         score[3], score[4]))

main()

#7 Odd/Even Counter
from random import randrange

def oddEven():
    odd, even = 0, 0
    for x in range(0, 100):
        number = randrange(0, 100)

        if number % 2 == 0:
            even += 1
        elif number % 2 != 0:
            odd += 1

    return even, odd

def main():
    even, odd = oddEven()
    print("Even: %d\nOdd: %d" % (even, odd))
    
main()

#8 Prime Numbers
def is_prime(number):
    if number == 1 or number == 2:
        return True
    else:
        for x in range(2, number):
            if number % x == 0:
                    return False
        return True

def main():
    number = int(input("Enter an integer: "))
    prime = is_prime(number)
    if prime == True:
        print("%d is a prime number." % number)
    else:
        print("%d is not a prime number." % number)

main()

#9 Prime Number List
def is_prime(number):
    if number == 1 or number == 2:
        return True
    else:
        for x in range(2, number):
            if number % x == 0:
                    return False
        return True

def main():
    for x in range(1, 101):
        if is_prime(x) == True:
            print(x)

main()

#10 Future Value
def value(present, rate, months):
    futureValue = present*(1+rate)**months
    return futureValue

def main():
    print("Future value will be: $%.2f" %
          value(float(input("Present value: ")),
                float(input("Interest rate: ")),
                int(input("Number of months: "))))
main()

#12 Rock, Paper, Scissors Game
import random
import time

def numberGen():
    random.seed(time.localtime())
    return random.randrange(1,3)

def userChoice():
    return input("1. Rock\n2. Paper\n3. Scissors\n"
                 "Enter your selection('q' to quit): ")

def compare(compChoice, userChoice):
    if str(compChoice) == userChoice:
        return 'retry'
    elif userChoice == '1' or userChoice == '2' or userChoice == '3':
        if userChoice == '1':
            if compChoice == 2:
                return 'lose'
            elif compChoice == 3:
                return 'win'
        elif userChoice == '2':
            if compChoice == 1:
                return 'win'
            elif compChoice == 3:
                return 'lose'
        elif userChoice == '3':
            if compChoice == 1:
                return 'lose'
            elif compChoice == 2:
                return 'win'
    else:
        return 'invalid'
    
def main():
    userInput = ''
    while userInput != 'q':
        compChoice = numberGen()
        while True:
            userInput = userChoice()
            if userInput == 'q':
                break
            elif compare(compChoice, userInput) == 'lose':
                print("---------")
                print("You lose.")
                print("---------")
                break
            elif compare(compChoice, userInput) == 'win':
                print("--------")
                print("You win!")
                print("--------")
                break
            elif compare(compChoice, userInput) == 'retry':
                print("-----------------")
                print("Tie! Try Again!")
                print("-----------------")
            else:
                print("--------------------------")
                print("Invalid entry!  Try Again!")
                print("--------------------------")
main()
