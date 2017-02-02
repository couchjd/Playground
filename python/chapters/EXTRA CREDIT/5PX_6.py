#6 Celsius to Farenheit Table

#prints conversion of C temps to F temps
def displayTemp():

    #temps 0C to 21C
    for x in range(0, 21):
        print("%d C\t%.1f F" % (x, ((9/5)*x)+32))

def main():
    displayTemp()

main()
