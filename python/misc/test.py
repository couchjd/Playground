import train
    
def main():
    while True:
        distance, factor = train.getDist(), train.factorGen()
        bounds = train.calcBounds(distance, factor)
        
        print("___________________________________________________________________________________________________________________________")
        print("\t\t\t\t\tCollision Simulation Chart")
        print("___________________________________________________________________________________________________________________________")
        print("|        |         |         |         |         |         |         |         |         |         |         |            |")
        print("|Distance|PfactorA |PfactorB |PopZoneA |PopZoneB |OpenZone |TraRate  |TrbRate  | Time to | Train A | Train B |  Collision |")
        print("|  (D)   |         |         |Boundary |Boundary |Boundary |  (Ra)   |  (Rb)   |Collision| Dist TDa| Dist TDb|    Type    |")
        print("|________|_________|_________|_________|_________|_________|_________|_________|_________|_________|_________|____________|")

        for x in range(5):
            speed = train.speedGen()
            collTime = train.calcTime(speed, distance)
            trainDist = train.distTraveled(speed, collTime)
            wreck = train.wreckType(trainDist, bounds, distance)
            
            print("__________________________________________________________________________________________________________________________")
            print("|%7d |%8.2f |%8.2f |%8d |%8d |%8d |%8d |%8d |%8.2f |%8.2f |%8.2f |%11s |" %
                  (distance, factor[1], factor[2], bounds['A'], bounds['B'], bounds['open'], speed[1], speed[2], collTime, trainDist[1], trainDist[2], wreck))

        retry = str.lower(input("Try again? "))
        if retry == 'n' or retry == 'no':
            break

main()
