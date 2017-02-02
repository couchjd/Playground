#3 Budget Analysis
def getBudget():
    budget = float(input("What is your monthly budget? "))
    return budget

#gets monthly cost for each item in expenseList
def getExpenses():
    total, expenses = 0, 0
    
    while expenses >= 0:    #sentinel value to check for negative value
        expenses = float(input("Input monthly costs (negative value when "\
                             "finished): ")) 
        if expenses >= 0:   #check for valid value to add to total
            total += expenses
        else:               #break if invalid value entered
            break
    return total            #return total monthly expenses
        
#calculates net $ in/out
def calcNetInOut(budget, expenses):
    net = budget - expenses
    return net

def main():
    print("Net in/out: $%.2f" % calcNetInOut(getBudget(), getExpenses()))

main()
