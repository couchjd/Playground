#1 Total Sales
def getSales():
    total, sales = 0, []
    for x in range(0, 7):
        sales.append(int(input('Day %d sales: ' % int(x+1))))
    for x in sales:
        total += x
    print('Total sales for week: $%.2f' % total)

def main():
    getSales()

main()

#2 Lottery Number Generator
import random
import time
def numGen():
    numbers = []
    random.seed(time.localtime())
    for x in range(0, 7):
        numbers.append(int(random.randrange(0, 10)))
        
    print('Your Lucky Lottery Numbers')
    print('---------------------------')
    for x in numbers:
        print('%d ' % x, end='')

def main():
    numGen()

main()

#3 Rainfall Statistics
def getRainfall():
    MONTHS = 12
    rain, total = [], 0
    for x in range(0, MONTHS):
        rain.append(float(input('Month %d rainfall: ' % int(x+1))))
    for x in rain:
        total += x
    return total, total/MONTHS, max(rain), min(rain)

def main():
    print('Total rain: %.2f\n'
          'Monthly average: %.2f\n'
          'Highest: %.2f\n'
          'Lowest: %.2f' % getRainfall())

main()

#4 Number Analysis Program
def getNumbers():
    numbers = []
    for x in range(0, 20):
        numbers.append(int(input('Enter a number (%d): ' % int(x+1))))
    return numbers

def results(numbers):
    high = max(numbers)
    low = min(numbers)
    total = 0
    for x in numbers:
        total += x
    average = total/len(numbers)
    return high, low, total, average

def main():
    print('Highest: %d\n'
          'Lowest: %d\n'
          'Total: %d\n'
          'Average: %d' % results(getNumbers()))

main()

#5 Charge Account Validation
def getInput():
    return int(input("Charge Account Number: "))

def readFile():
    acctList = []
    with open('charge_accounts.txt', 'r') as accounts:
        for x in accounts:
            acctList.append(int(x))
        return acctList
    
def main():
    userInput = getInput()
    found = 0

    for x in readFile():
        if x == userInput:
            found = x
            break
        else:
            found = 0

    if found != 0:
        print("Account #%d found." % found)
    else:
        print("Account not found.")

main()

