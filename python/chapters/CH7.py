#1 File Display
def printFile(fileName):
    print(open(fileName, 'r').read())
    
def main():
    printFile('numbers.txt')
    
main()

#2 File Head Display
def printHead(fileName):
    with open(fileName) as readFile:
        for x in range(0, 5):
            print(readFile.readline(), end='')

def main():
    printHead(input("Input file name: "))
    
main()

#3 Line Numbers
def printFile(fileName):
    with open(fileName) as readFile:
        lineNumber = 1
        for x in readFile:
            print(lineNumber, '\t', readFile.readline(), end='')
            lineNumber += 1
    
def main():
    printFile(input("Input file name: "))
    
main()

#4 Item Counter
def nameCount(fileName):
    with open(fileName) as names:
        nameCount = 0
        for x in names:
            nameCount += 1
        print(nameCount, 'names in the file.')
    
def main():
    nameCount('names.txt')
    
main()

#5 Sum of Numbers
def addTotal(fileName):
    sumNums = 0
    with open(fileName) as numFile:
        numbers = numFile.read().split()
        for x in numbers:
            sumNums += int(x)
        return sumNums

def main():
    print('The total is %d.' % addTotal('G:\\python\\chapters\\numbers.txt'))

main()

#6 Average of Numbers
def average(fileName):
    sumNums= 0
    with open(fileName) as numFile:
        numbers = numFile.read().split()
        for x in numbers:
            sumNums += int(x)
        average = float(sumNums)/len(numbers)
        return average

def main():
    print('The average is %.2f.' % average('numbers.txt'))

main()

#7 Random Number File Writer
import random

def numberWriter(fileName):
    with open(fileName, 'w') as numbers:
        for x in range(0, int(input("How many numbers "
                                    "do you want to input? "))):
            numbers.write(str(random.randrange(1, 100)))
            numbers.write(' ')

def main():
    numberWriter('nums.txt')

main()

#8 Random Number File Reader
def numberReader(fileName):
    with open(fileName) as numFile:
        total, count = 0, 0
        numbers = numFile.read().split()
        for x in numbers:
            total += int(x)
            count += 1
        return total, count

def main():
    total, number = numberReader('nums.txt')
    print('# of Values\tTotal of Values')
    print('------------------------------------')
    print(number, '\t\t', total)

main()

#9 Exception Handling
def average(fileName):
    sumNums = 0
    try:
        with open(fileName) as numFile:
            numbers = numFile.read().split()
            for x in numbers:
                sumNums += int(x)
            average = float(sumNums)/len(numbers)
            return average
    except IOError:
        print('Could not read the file', fileName)
    except ValueError:
        print('Non-numeric data found in the file.')
        
def main():
    try:
        print('The average is %.2f.' % average('numbers.txt'))
    except:
        print('An error occurred.')
main()

#10 Golf Scores
#The assignment called for two separate programs, I have separated them into
#two functions and called them both from within one main function.
def getRecords():
    numRecords = int(input('How many golfers? '))
    with open('golf.txt', 'w') as golfers:
        for x in range(1, numRecords+1):
            print('Golfer %d' % x)
            print('-----------------------')
            golfers.write(input('Name: ') + '\n')
            golfers.write(input('Score: ') + '\n')
            print()

def printRecords():
    with open('golf.txt', 'r') as golf:
        name = golf.readline().rstrip('\n')
        while name != '':
            score = golf.readline().rstrip('\n')

            print('Name: ', name)
            print('Score: ', score)
            print()
            name = golf.readline().rstrip('\n')        

def main():
    getRecords()
    printRecords()
    
main()
