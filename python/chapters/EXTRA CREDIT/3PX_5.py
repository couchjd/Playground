def getValue():
    landValue = float(input("Input land value: "))
    return landValue

def calcTax(landValue):
    global assessmentValue, propertyTax
    assessmentValue = landValue * .6
    propertyTax = assessmentValue * (.64/100)

def main():
    calcTax(getValue())
    print("Assessment value: $%.2f\nProperty tax: $%.2f" %
          (assessmentValue, propertyTax))

main()
