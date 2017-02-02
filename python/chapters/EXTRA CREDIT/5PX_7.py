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
