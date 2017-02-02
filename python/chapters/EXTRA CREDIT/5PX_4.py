#4 Distance Traveled

#gets and returns speed and time traveled
def getInfo():
    info = {}
    info['speed'] = int(input("What is the speed of the vehicle in mph? "))
    info['time'] = int(input("How many hours has it traveled? "))
    return info

#prints distance travelled for each hour
def printHours(info):
    print('\nHours\tDistance')
    print('-----------------')
    for x in range(1, info['time']+1):
        print("%d\t%d\t" %
            (x, (x*info['speed'])))

def main():
    printHours(getInfo())

main()
