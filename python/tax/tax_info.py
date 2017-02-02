STATE_TAX = .04
COUNTY_TAX = .02

def calcInfo(monthlySales):
    global countyTaxAmt, stateTaxAmt, totalSalesTax
    countyTaxAmt = monthlySales * COUNTY_TAX
    stateTaxAmt = monthlySales * STATE_TAX
    totalSalesTax = countyTaxAmt + stateTaxAmt

def getInfo():
    monthlySales = float(input("Total monthly sales: "))
    return monthlySales

def displayInfo():
    print("County sales tax: %.2f\nState sales tax: %.2f\nTotal sales tax: %.2f" %
          (countyTaxAmt, stateTaxAmt, totalSalesTax))
