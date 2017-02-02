STATE_TAX = .04
COUNTY_TAX = .02

def getInfo():
    monthlySales = float(input("Total monthly sales: "))
    return monthlySales

def calcInfo(monthlySales):
    tax = {}
    tax['county'] = monthlySales * COUNTY_TAX
    tax['state'] = monthlySales * STATE_TAX
    tax['total'] = tax['county'] + tax['state']
    return tax

def displayInfo(tax):
    print("County sales tax: $%.2f\nState sales tax: $%.2f\
          \nTotal sales tax: $%.2f" %
          (tax['county'], tax['state'], tax['total']))
          
def main():
    displayInfo(calcInfo(getInfo()))
          
main()

