#9 Shipping Charges
def getInput():
    weight = int(input("Weight of package: "))
    return weight

def calcCharges(weight):
    if weight <= 2:
        price = weight*1.10
    elif weight > 2 and weight <= 6:
        price = weight*2.20
    elif weight > 6 and weight <= 10:
        price = weight*3.70
    elif weight > 10:
        price = weight*3.80
    else:
        print("Invalid entry!")
        price = 0
    return price

def main():
    print("Shipping charges: $%.2f" % calcCharges(getInput()))

main()
