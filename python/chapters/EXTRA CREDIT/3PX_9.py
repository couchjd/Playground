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
