def getInfo():
    global fatCal, carbCal
    fatCal = int(input("Grams of fat: "))*9
    carbCal = int(input("Grams of carbs: "))*4

def printInfo(fatCal, carbCal):
    print("%d calories from fat.\n%d calories from carbs." %
          (fatCal, carbCal))

def main():
    getInfo()
    printInfo(fatCal, carbCal)

main()
