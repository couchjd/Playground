#1
print("""Jeff Couch
4608 Sierra Morena Ave
Carlsbad, CA  92010
760.703.4873
Computer Science""")

#2
projectedSales = input("Enter projected smount of total sales: ")
profit = float(projectedSales)*.23
print("Profit = $" + "%.2f" % profit)

#3
totalSquareFeet = input("Enter the total amount of square feet: ")
acres = float(totalSquareFeet)/43560
print("That is %.2f acres." % acres)

#4
items = []
subtotal = 0
salesTax = .06

for x in range(0,5):
    items.append(input("Cost of item %d: " % int(x+1)))
    subtotal = subtotal + float(items[x])
print("Subtotal = $%.2f" % subtotal)
print("Tax = $%.2f" % float(subtotal*salesTax))
print("Total = $%.2f" % float(subtotal+(subtotal*salesTax)))

#5
speed = 60

print("The car will travel %d miles in 5 hours" % int(speed*5))
print("The car will travel %d miles in 8 hours" % int(speed*8))
print("The car will travel %d miles in 12 hours" % int(speed*12))

#6
stateTax = .04
countyTax = .02

subtotalGet = input("Input item price: ")
subtotal = float(subtotalGet)
stateTaxAmt = float(subtotal * stateTax)
countyTaxAmt = float(subtotal * countyTax)
totalTaxAmt = float(stateTaxAmt + countyTaxAmt)
total = float(subtotal + totalTaxAmt)

print("Subtotal = $%.2f" % subtotal)
print("State Tax = $%.2f" % stateTaxAmt)
print("County Tax = $%.2f" % countyTaxAmt)
print("Total Tax = $%.2f" % totalTaxAmt)
print("Total = $%.2f" % total)

#7
milesDriven = input("Input miles driven: ")
gallonsUsed = input("Input gallons used: ")

MPG = float(milesDriven)/float(gallonsUsed)

print("That is %f miles per gallon." % MPG)

#8
tipPercent = .15
taxPercent = .07

subtotalGet = input("Input meal price: ")
subtotal = float(subtotalGet)

taxAmt = subtotal * taxPercent
tipAmt = subtotal * tipPercent
total = taxAmt + tipAmt + subtotal

print("Subtotal = $%.2f" % subtotal)
print("Tax = $%.2f" % taxAmt)
print("Tip = $%.2f" % tipAmt)
print("Total = $%.2f" % total) 

#9
def farenheit(celsius):
    tempFarenheit = ((9/5)*int(celsius))+32
    print("That is %d degrees farenheit." % tempFarenheit)

farenheit(input("Enter a temperature in degrees celsius: "))

#10
stocksBought = 1000
purchasePrice = 32.87
pCommission = .02
stocksSold = 1000
sellPrice = 33.97
sCommission = .02

amtPaid = stocksBought * purchasePrice
pCommAmt = amtPaid * pCommission
amtSold = stocksSold * sellPrice
sCommAmt = amtSold * sCommission

netGain = (amtSold - amtPaid)-(pCommAmt + sCommAmt)

print("Amount paid = $%.2f" % amtPaid)
print("Purchase commission = $%.2f" % pCommAmt)
print("Amount sold = $%.2f" % amtSold)
print("Sale commission = $%.2f" % sCommAmt)
print("Net gain/loss = $%.2f" % netGain)
input()
