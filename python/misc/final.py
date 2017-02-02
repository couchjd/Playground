import random

def getDist():
    while True:
        totalDist = input("Input distance between 500 and 1000 miles: ")
        try:
            totalDist = float(totalDist)
            if totalDist >= 500 and totalDist <= 1000:
                return totalDist
                break
            else:
                print("Invalid entry!")
        except:
            print("Invalid entry!")

def factorGen():
    factor = {}
    for x in range(1, 3):
        factor[x] = float(random.randint(10, 50)/100)
    return factor

def speedGen():
    speed = {}
    for x in range(1, 3):
        speed[x] = float(random.randint(70, 120))
    return speed

def calcBounds(distance, factor):
    bounds = {}
    bounds['A'] = float(distance*factor[1])
    bounds['B'] = float(distance*factor[2])
    bounds['open'] = distance - (bounds['A'] + bounds['B'])
    return bounds

def calcTime(speed, dist):
    collTime = float(dist/int((speed[1]+speed[2])))
    return collTime

def distTraveled(speed, time):
    dist = {}
    for x in speed:
        dist[x] = float(time*speed[x])
    return dist

def wreckType(trainDist, bounds, distance):
    if (((trainDist[1] > bounds['A']) and
         (trainDist[1] < bounds['A'] + bounds['open'])) and
        ((trainDist[2] > bounds['B']) and
         (trainDist[2] < bounds['B'] + bounds['open']))):
        return 'wreck'
    else:
        return "disaster"
    
def main():
    random.seed(5)

    while True:
        distance, factor = getDist(), factorGen()
        bounds = calcBounds(distance, factor)
        
        print("___________________________________________________________________________________________________________________________")
        print("\t\t\t\t\tCollision Simulation Chart")
        print("___________________________________________________________________________________________________________________________")
        print("|        |         |         |         |         |         |         |         |         |         |         |            |")
        print("|Distance|PfactorA |PfactorB |PopZoneA |PopZoneB |OpenZone |TraRate  |TrbRate  | Time to | Train A | Train B |  Collision |")
        print("|  (D)   |         |         |Boundary |Boundary |Boundary |  (Ra)   |  (Rb)   |Collision| Dist TDa| Dist TDb|    Type    |")
        print("|________|_________|_________|_________|_________|_________|_________|_________|_________|_________|_________|____________|")

        for x in range(5):
            speed = speedGen()
            collTime = calcTime(speed, distance)
            trainDist = distTraveled(speed, collTime)
            wreck = wreckType(trainDist, bounds, distance)
            
            print("__________________________________________________________________________________________________________________________")
            print("|%7d |%8.2f |%8.2f |%8d |%8d |%8d |%8d |%8d |%8.2f |%8.2f |%8.2f |%11s |" %
                  (distance, factor[1], factor[2], bounds['A'], bounds['B'],
                   bounds['open'], speed[1], speed[2], collTime, trainDist[1], trainDist[2], wreck))

        retry = str.lower(input("Run again? "))
        if retry == 'n' or retry == 'no':
            break

main()
