def calcInsurance(homeValue):
    insuranceAmt = float(homeValue)*.80
    return insuranceAmt

def main():
    print("You need at least $%.2f of insurance." %
          calcInsurance(input("What is the value of your home? ")))

main()
