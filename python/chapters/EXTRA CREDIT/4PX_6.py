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
