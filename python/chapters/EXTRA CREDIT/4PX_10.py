#10 BMI Enhancement
def getInfo():
    info = {}
    info['height'] = float(input("Height (in inches): "))
    info['weight'] = float(input("Weight (in pounds): "))
    return info

def calcBMI(height, weight):
    BMI = (weight*703/(height**2))
    return BMI

def optimal(BMI):
    if BMI < 18.5:
        print("You are underweight.")
    if BMI >= 18.5 and BMI <= 25:
        print("You are at optimal weight.")
    if BMI > 25:
        print("You are overweight.")
        
def main():
    info = getInfo()
    print("Your BMI is %.2f." % calcBMI(info['height'], info['weight']))
    optimal(calcBMI(info['height'], info['weight']))

main()
