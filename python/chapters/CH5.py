#1 Bug Collector
def getBugs():
    bugs = []

    #gets number of bugs collected each day for a week
    for x in range(0, 7):
        bugs.insert(x, int(input("Number of bugs collected on day %d: "
                                 % int(x+1))))
    return bugs #returns a list containing number of bugs collected per day
    
def calcBugs(days):
    #calculates total number of bugs collected
    totalBugs = 0
    for x in days:
        totalBugs += x
    return totalBugs

def main():
    print("Total bugs collected: %d" % calcBugs(getBugs()))
    
main()

#2 Calories Burned
def caloriesBurned():
    CAL_PER_MIN = 3.9
    TIME = [10, 15, 20, 35, 30]

    #prints calories burned for each value in TIME
    for x in TIME:
        print("%.2f calories burned in %d minutes." %
                      ((x * CAL_PER_MIN), x))

def main():
    caloriesBurned()
    
main()

#3 Budget Analysis
def getBudget():
    budget = float(input("What is your monthly budget? "))
    return budget

#gets monthly cost for each item in expenseList
def getExpenses():
    total, expenses = 0, 0
    
    while expenses >= 0:    #sentinel value to check for negative value
        expenses = float(input("Input monthly costs (negative value when "\
                             "finished): ")) 
        if expenses >= 0:   #check for valid value to add to total
            total += expenses
        else:               #break if invalid value entered
            break
    return total            #return total monthly expenses
        
#calculates net $ in/out
def calcNetInOut(budget, expenses):
    net = budget - expenses
    return net

def main():
    print("Net in/out: $%.2f" % calcNetInOut(getBudget(), getExpenses()))

main()

#4 Distance Traveled

#gets and returns speed and time traveled
def getInfo():
    info = {}
    info['speed'] = int(input("What is the speed of the vehicle in mph? "))
    info['time'] = int(input("How many hours has it traveled? "))
    return info

#prints distance travelled for each hour
def printHours(info):
    print('\nHours\tDistance')
    print('-----------------')
    for x in range(1, info['time']+1):
        print("%d\t%d\t" %
            (x, (x*info['speed'])))

def main():
    printHours(getInfo())

main()

#5 Rainfall

#gets number of years
def getYears():
    years = int(input("Input number of years: "))
    return years

#gets monthly rainfall for specified number of years
def getRainfall(years):
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December']
    rainfall = 0
    for x in range(0, years):   #iterate for # of years
        for y in months:    #iterate for number of months
            rainfall += float(input("Year %d: %s rainfall in inches: " %
                                    ((x+1), y)))
    return rainfall

def main():
    years = getYears()
    rainfall = getRainfall(years)

    #prints total and average rainfall
    print("\nNumber of Months\tTotal Rainfall\t\tAverage Rainfall Per Month")
    print("----------------------------------"\
          "----------------------------------------")
    print("%d\t\t\t%.1f in.\t\t%.1f in." %
          ((years*12), rainfall, (rainfall/(years*12))))
      
main()

#6 Celsius to Farenheit Table

#prints conversion of C temps to F temps
def displayTemp():

    #temps 0C to 21C
    for x in range(0, 21):
        print("%d C\t%.1f F" % (x, ((9/5)*x)+32))

def main():
    displayTemp()

main()

#7 Pennies for Pay
def getDays():
    days = int(input("Enter number of days: "))
    return days

#calculates pay after designated amount of days
def calcPay(days):
    pay = .01 #initialze pay as 1 penny for first day
    totalPay = 0 #initialize totalPay
    
    for x in range(0, days):
        #prints current day and pay for current day
        print("Day %d: $%.2f\n" % (x+1, pay))
        totalPay += pay
        pay = pay*2
        
    #displays total pay after designated number of days
    print("Total pay: $%.2f" % totalPay)
    
def main():
    calcPay(getDays())

main()


#8 Sum of Numbers
def getNumbers():
    numbers = []
    sumValue = 0
    x = 0

    #gets integers from user
    while True:
        numbers.insert(x, int(input("Enter number %d: " % int(x+1))))
        sumValue += numbers[x]  #adds each number to sum
        if numbers[x] < 0:
            break   #breaks from loop if negative integer is entered
        x += 1    
    print("The sum is: %d" % sumValue)

def main():
    getNumbers()

main()

#9 Star Pattern
def printStars():
    for x in range(7):	#iterates through outer loop

        #inner loop -- designates number of *
        #to be printed per line
        for y in range(7-x):	

            #prints * pattern and strips trailing newline
            print('*', end='')
        print()

def main():
    printStars()

main()

#10 Pound Pattern
def printPound():
	for x in range(6):  #iterates through outer loop
		print('#', end='')  #prints initial # once per line

                #inner loop -- designates number of ' '
		#to be printed per line
		for y in range(x):
			print(' ', end='')  #prints blank spaces
		print('#')  #prints # at end of line

def main():
	printPound()
	
main()
