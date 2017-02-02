import random
random.seed(5)

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
