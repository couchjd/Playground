#4 Falling Distance
GRAVITY = 9.8

def falling_distance(fallingTime):              #computes distance fallen in
    distance = ((1/2)*GRAVITY*fallingTime**2)   #a specific amount of time
    return distance

def main():
    print("Time(sec)\tDistance(feet)")
    print("------------------------------")
    for x in range(10):  #prints the distance fallen each second for 10 sec.
        print("%d\t\t%.1f" % (x+1, falling_distance(x)))

main()
