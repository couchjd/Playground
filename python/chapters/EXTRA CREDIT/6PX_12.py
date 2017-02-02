#12 Rock, Paper, Scissors Game
import random
import time

def numberGen():    #generates a random value to be used as the computer's choice
    random.seed(time.localtime())
    return random.randrange(1,3)

def compare(compChoice, userChoice):    #compares user choice vs computer choice
    compDict = {1:'rock', 2:'paper', 3:'scissors'}
    if compDict[compChoice] == userChoice:  #retry if user and computer choose
        return 'retry'                      #the same value
    #compare user choice vs computer choice and returns win or lose values
    elif userChoice == 'rock' or userChoice == 'paper' or userChoice == 'scissors':
        if userChoice == 'rock':
            if compChoice == 2:
                return 'lose'
            elif compChoice == 3:
                return 'win'
        elif userChoice == 'paper':
            if compChoice == 1:
                return 'win'
            elif compChoice == 3:
                return 'lose'
        elif userChoice == 'scissors':
            if compChoice == 1:
                return 'lose'
            elif compChoice == 2:
                return 'win'
    else:
        return 'invalid'    #check for invalid input
    
def main():
    userInput = ''
    while userInput != 'q': #terminate on 'q'
        compChoice = numberGen()
        while True:
            userInput = input("Rock\nPaper\nScissors\n"
                              "Enter your selection('q' to quit): ")
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
            elif compare(compChoice, userInput) == 'invalid':
                print("--------------------------")
                print("Invalid entry!  Try Again!")
                print("--------------------------")
main()
