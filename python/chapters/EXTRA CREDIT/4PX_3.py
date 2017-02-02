#3 Mass and Weight
def getMass():
    mass = float(input("Input object mass: "))
    return mass

def calcWeight(mass):
    weight = mass * 9.8
    return weight

def compareWeight(weight):
    if weight > 10:
        print("The object is too heavy.")
    elif weight < 10:
        print("The object is too light.")
    elif weight == 10:
        print("The object is the correct weight.")

def main():
    compareWeight(calcWeight(getMass()))

main()
