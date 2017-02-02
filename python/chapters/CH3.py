#1 Miles
def main():
    print("That is %f miles" % milesConvert(input("Input kilometers: ")))
    
def milesConvert(kilometers):
    miles = float(kilometers)*0.6214
    return miles

main()

#2 Sales Tax
def main():
    subtotal = float(input("Input item price: "))
    output(subtotal,
           calcStateTax(subtotal),
           calcCountyTax(subtotal),
           calcTotalTax(calcStateTax(subtotal), calcCountyTax(subtotal)),
           calcTotal(calcTotalTax(calcStateTax(subtotal), calcCountyTax(subtotal)), subtotal))
    
def calcStateTax(subtotal):
    stateTax = .04
    stateTaxAmt = subtotal * stateTax
    return stateTaxAmt

def calcCountyTax(subtotal):
    countyTax = .02
    countyTaxAmt = subtotal * countyTax
    return countyTaxAmt

def calcTotalTax(stateTaxAmt, countyTaxAmt):
    totalTaxAmt = stateTaxAmt + countyTaxAmt
    return totalTaxAmt

def calcTotal(subtotal, totalTax):
    total = subtotal + totalTax
    return total

def output(subtotal, stateTaxAmt, countyTaxAmt, totalTaxAmt, total):
    print("Subtotal = $%.2f" % subtotal)
    print("State Tax = $%.2f" % stateTaxAmt)
    print("County Tax = $%.2f" % countyTaxAmt)
    print("Total Tax = $%.2f" % totalTaxAmt)
    print("Total = $%.2f" % total)

main()

#3 Insurance
def calcInsurance(homeValue):
    insuranceAmt = float(homeValue)*.80
    return insuranceAmt

def main():
    print("You need at least $%.2f of insurance." % calcInsurance(input("What is the value of your home? ")))

main()

#4 Cost of Ownership
def main():
    getCosts()
    calcCosts(loan, insurance, gas, oil, tires, maintenance)
    
def calcCosts(loan, insurance, gas, oil, tires, maintenance):
    monthlyCost = loan + insurance + gas + oil + tires + maintenance
    yearlyCost = monthlyCost*12	
    print("Monthly cost is $%.2f." % monthlyCost)
    print("Yearly cost is $%.2f." % yearlyCost)	
		
def getCosts():
    global loan, insurance, gas, oil, tires, maintenance
    loan = float(input("Input loan payment amount: "))
    insurance = float(input("Input insurance payment amount: "))
    gas = float(input("Input monthly gas costs: "))
    oil = float(input("Input monthly oil costs: "))
    tires = float(input("Input monthly tire cost: "))
    maintenance = float(input("Input monthly maintenance cost: "))

main()

#5 Property Tax
def getValue():
    landValue = float(input("Input land value: "))
    return landValue

def calcTax(landValue):
    global assessmentValue, propertyTax
    assessmentValue = landValue * .6
    propertyTax = assessmentValue * (.64/100)

def main():
    calcTax(getValue())
    print("Assessment value: $%.2f\nProperty tax: $%.2f" % (assessmentValue, propertyTax))

main()

#6 BMI
def getInfo():
    global height, weight
    height = float(input("Height (in inches): "))
    weight = float(input("Weight (in pounds): "))

def calcBMI(height, weight):
    BMI = (weight*703/(height**2))
    return BMI

def main():
    getInfo()
    print("Your BMI is %f." % calcBMI(height, weight))

main()

#7 Calories
def getInfo():
    global fatCal, carbCal
    fatCal = int(input("Grams of fat: "))*9
    carbCal = int(input("Grams of carbs: "))*4

def printInfo(fatCal, carbCal):
    print("%d calories from fat.\n%d calories from carbs." % (fatCal, carbCal))

def main():
    getInfo()
    printInfo(fatCal, carbCal)

main()

#8 Stadium Seating
CLASS_A_PRICE = 15
CLASS_B_PRICE = 12
CLASS_C_PRICE = 9

def getSeatsSold():
    global classA, classB, classC
    classA = int(input("Number of Class A tickets sold: "))
    classB = int(input("Number of Class B tickets sold: "))
    classC = int(input("Number of Class C tickets sold: "))

def calcIncome(classA, classB, classC):
    income = float((classA*CLASS_A_PRICE)+(classB*CLASS_B_PRICE)+(classC*CLASS_C_PRICE))
    return income

def main():
    getSeatsSold()
    print("Total income: $%.2f" % calcIncome(classA, classB, classC))

main()

#9 Paint Job
HOURLY_LABOR = 20.00

def getInfo():
    userInput = {}
    userInput['area'] = float(input("Square footage of area to be painted: "))
    userInput['gallonPrice'] = float(input("Price per gallon of paint: "))
    return userInput

def calcInfo(userInput):
    results = {}
    results['gallons'] = userInput['area']/115
    results['hours'] = results['gallons']*8
    results['paintPrice'] = userInput['gallonPrice']*results['gallons']
    results['laborCharges'] = results['hours']*HOURLY_LABOR
    results['totalCost'] = results['laborCharges'] + results['paintPrice']
    return results

def displayInfo(results):
    print("Gallons required: %.2f\nHours of labor: %.2f\
          \nPaint cost: $%.2f\nLabor charges: $%.2f\nTotal cost: $%.2f"
    % (results['gallons'], results['hours'], results['paintPrice'],
       results['laborCharges'], results['totalCost']))
    
def main():
    displayInfo(calcInfo(getInfo()))
    
main()

#10 Monthly sales tax
STATE_TAX = .04
COUNTY_TAX = .02

def getInfo():
    monthlySales = float(input("Total monthly sales: "))
    return monthlySales

def calcInfo(monthlySales):
    tax = {}
    tax['county'] = monthlySales * COUNTY_TAX
    tax['state'] = monthlySales * STATE_TAX
    tax['total'] = countyTaxAmt + stateTaxAmt
    return tax

def displayInfo(tax):
    print("County sales tax: $%.2f\nState sales tax: $%.2f\nTotal sales tax: $%.2f" %
          (tax['county'], tax['state'], tax['total']))
          
def main():
    displayInfo(calcInfo(getInfo()))
          
main()
