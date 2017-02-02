#1 Roman Numerals
def numerals(userInput):
    if userInput == '1':
        print("I")
    elif userInput == '2':
        print("II")
    elif userInput == '3':
        print("III")
    elif userInput == '4':
        print("IV")
    elif userInput == '5':
        print("V")
    elif userInput == '6':
        print("VI")
    elif userInput == '7':
        print("VII")
    elif userInput == '8':
        print("VIII")
    elif userInput == '9':
        print("IX")
    elif userInput == '10':
        print("X")
    else:
        print("Invalid entry value!")
        return 1

def main():
    flag = 1
    while(flag == 1):
        flag = numerals(input("Please enter a number 1-10: "))
        
main()

#2 Areas of Rectangles
def getInfo():
    length = []
    width = []
    area = []

    for x in range(0, 2):
        length.insert(x, input("Input length of rectangle %d: " % int(x+1)))
        width.insert(x, input("Input width of rectangle %d: " % int(x+1)))
        area.insert(x, int(length[x])*int(width[x]))
    return area
    
def compareArea(area):
    if area[0] > area[1]:
        print("Rectangle 1 is larger than Rectangle 2.")
    elif area[0] < area[1]:
        print("Rectangle 2 is larger than Rectangle 1.")
    elif area[0] == area [1]:
        print("The rectangles are the same size.")
        
def main():
    compareArea(getInfo())
    
main()

#3 Mass and Weight
def getMass():
    mass = float(input("Input object mass: "))
    return mass

def calcWeight(mass):
    weight = mass * 9.8
    return weight

def compareWeight(weight):
    if weight > 10:
        print("The object is too heavy.")
    elif weight < 10:
        print("The object is too light.")
    elif weight == 10:
        print("The object is the correct weight.")

def main():
    compareWeight(calcWeight(getMass()))

main()

#4 Magic dates
def getInput():
    date = {}
    date['month'] = int(input("Enter month: "))
    date['day'] = int(input("Enter day: "))
    date['year'] = int(input("Enter two digit year: "))
    return date

def calcInfo(date):
    if date['month']*date['day'] == date['year']:
        print("That is a magic date!")
    else:
        print("That is not a magic date.")
def main():
    calcInfo(getInput())

main()

#5 Color Mixer
def getColors():
    colors = []
    for x in range(0, 2):
        colors.insert(x, input("Input primary color #%d: " % int(x+1)))
    return colors

def mixColors(colors):
    if colors[0] == 'red':
        if colors[1] == 'red':
            return 'red'
        if colors[1] == 'blue':
            return 'purple'
        if colors[1] == 'yellow':
            return 'orange'
        else:
            print("%s is not a primary color." % colors[1])

    if colors[0] == 'blue':
        if colors[1] == 'red':
            return 'purple'
        if colors[1] == 'blue':
            return 'blue'
        if colors[1] == 'yellow':
            return 'green'
        else:
            print("%s is not a primary color." % colors[1])
            
    if colors[0] == 'yellow':
        if colors[1] == 'red':
            return 'orange'
        if colors[1] == 'blue':
            return 'green'
        if colors[1] == 'yellow':
            return 'yellow'
        else:
            print("%s is not a primary color." % colors[1])
            
    else:
        print("%s is not a primary color." % colors[0])

def main():
    print("That makes %s." % mixColors(getColors()))

main()

#6 Change for a Dollar
def getInfo():
    coins = {}
    coins['pennies'] = float(input("Number of pennies: "))
    coins['nickles'] = float(input("Number of nickles: "))
    coins['dimes'] = float(input("Number of dimes: "))
    coins['quarters'] = float(input("Number of quarters: "))
    return coins

def calcInfo(coins):
    pennyTotal = coins['pennies']*.01
    nickleTotal = coins['nickles']*.05
    dimeTotal = coins['dimes']*.10
    quarterTotal = coins['quarters']*.25
    return pennyTotal+nickleTotal+dimeTotal+quarterTotal

def compTotal(total):
    if total > 1.00 or total < 1.00:
        if total > 1.00:
            print("$%.2f is greater than $1.00." % total)
        if total < 1.00:
            print("$%.2f is less than $1.00." % total)
    elif total == 1.00:
        print("Congratulations!  That is exactly $1.00!")

def main():
    compTotal(calcInfo(getInfo()))

main()

#7 Book Club Points
def getInput():
    books = int(input("Books purchased this month: "))
    return books

def calcPoints(books):
    if books == 0:
        points = 0
    elif books == 1:
        points = 5
    elif books == 2:
        points = 15
    elif books == 3:
        points = 30
    elif books >= 4:
        points = 60
    return points

def main():
    print("You have earned %d points this month!" % calcPoints(getInput()))

main()

#8 Software Sales
def getInput():
    packages = int(input("Number of packages purchased: "))
    return packages

def discount(packages):
    if packages >= 10 and packages <= 19:
        discount = (packages*99) * .2
    elif packages >= 20 and packages <= 49:
        discount = (packages*99) * .3
    elif packages >= 50 and packages <= 99:
        discount = (packages*99) * .4
    elif packages >= 100:
        discount = (packages*99) * .5
    else:
        discount = 0
        
    return discount

def calcDiscount(discount, packages):
    subtotal = packages * 99
    total = subtotal - discount
    return total

def main():
    packages = getInput()
    print("Discount: $%.2f\nTotal: $%.2f" %
          (discount(packages), calcDiscount(discount(packages), packages)))

main()

#9 Shipping Charges
def getInput():
    weight = int(input("Weight of package: "))
    return weight

def calcCharges(weight):
    if weight <= 2:
        price = weight*1.10
    if weight > 2 and weight <= 6:
        price = weight*2.20
    if weight > 6 and weight <= 10:
        price = weight*3.70
    if weight > 10:
        price = weight*3.80
    else:
        print("Invalid entry!")
        price = 0
    return price

def main():
    print("Shipping charges: $%.2f" % calcCharges(getInput()))

main()

#10 BMI Enhancement
def getInfo():
    info = {}
    info['height'] = float(input("Height (in inches): "))
    info['weight'] = float(input("Weight (in pounds): "))
    return info

def calcBMI(height, weight):
    BMI = (weight*703/(height**2))
    return BMI

def optimal(BMI):
    if BMI < 18.5:
        print("You are underweight.")
    if BMI >= 18.5 and BMI <= 25:
        print("You are at optimal weight.")
    if BMI > 25:
        print("You are overweight.")
        
def main():
    info = getInfo()
    print("Your BMI is %.2f." % calcBMI(info['height'], info['weight']))
    optimal(calcBMI(info['height'], info['weight']))

main()

#11 Time Calculator
def getInfo():
    seconds = int(input("Enter seconds: "))
    return seconds

def calcResults(seconds):
    if seconds >= 86400:
        days = seconds/86400
        hours = (seconds%86400)/3600
        minutes = ((seconds%86400)%3600)/60
        seconds = ((seconds%86400)%3600)%60
        print("%d days\n%d hours\n%d minutes\n%d seconds" %
              (days, hours, minutes, seconds))

    elif seconds >= 3600:
        hours = seconds/3600
        minutes = (seconds%3600)/60
        seconds = seconds%60
        print("%d hours\n%d minutes\n%d seconds" %
              (hours, minutes, seconds))

    elif seconds >= 60:
        minutes = seconds/60
        seconds = seconds%60
        print("%d minutes\n%d seconds" %
              (minutes, seconds))

    elif seconds < 60:
        print("%d seconds" %
              seconds)

def main():
    calcResults(getInfo())

main()
