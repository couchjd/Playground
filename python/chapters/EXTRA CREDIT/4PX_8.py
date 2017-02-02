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
