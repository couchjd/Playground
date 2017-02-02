import random

def getDist():
    while True:
        try:
            distance = float(input("Input distance between 500-1000: "))
            if distance >= 500 and distance <= 1000:
                return distance
            else:
                print("Invalid Entry.")
        except:
            print("Invalid Entry.")

def popZone(distance):
    factorA = float(random.randint(10, 50)/100)
    factorB = float(random.randint(10, 50)/100)
    popZoneA = float(distance*factorA)
    popZoneB = float(distance*factorB)
    openZone = float(distance - (popZoneA + popZoneB))
    return popZoneA, popZoneB, openZone

def speed():
    rateA = random.randint(70, 120)
    rateB = random.randint(70, 120)
    return rateA, rateB

def timeToColl(distance, rateA, rateB):
    time = distance/(rateA+rateB)
    return time

def trainDist(rateA, rateB, time):
    aDist = rateA * time
    bDist = rateB * time
    return aDist, bDist

def collType(aDist, bDist, popA, popB, openZone):
    if(((aDist > popA) and (aDist < (popA + openZone))) and
       ((bDist > popB) and (bDist < (popB + openZone)))):
        return 'wreck'
    else:
        return 'disaster'

def main():
    random.seed(5)
    distance = getDist()
    popA, popB, openZone = popZone(distance)
    print(popA, popB, openZone)
    for x in range(0, 5):
        rateA, rateB = speed()
        time = timeToColl(distance, rateA, rateB)
        aDist, bDist = trainDist(rateA, rateB, time)
        print(collType(aDist, bDist, popA, popB, openZone), rateA, rateB, time, aDist, bDist)
        
main()
