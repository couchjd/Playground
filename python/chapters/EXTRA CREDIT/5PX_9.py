#9 Star Pattern
def printStars():
    for x in range(7):	#iterates through outer loop

        #inner loop -- designates number of *
        #to be printed per line
        for y in range(7-x):	

            #prints * pattern and strips trailing newline
            print('*', end='')
        print()

def main():
    printStars()

main()
