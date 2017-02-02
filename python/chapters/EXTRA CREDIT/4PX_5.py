#5 Color Mixer
def getColors():
    colors = []
    for x in range(0, 2):
        colors.insert(x, input("Input primary color #%d: " % int(x+1)))
    return colors

def mixColors(colors):
    if colors[0] == 'red':
        if colors[1] == 'red':
            return 'red'
        if colors[1] == 'blue':
            return 'purple'
        if colors[1] == 'yellow':
            return 'orange'
        else:
            print("%s is not a primary color." % colors[1])

    if colors[0] == 'blue':
        if colors[1] == 'red':
            return 'purple'
        if colors[1] == 'blue':
            return 'blue'
        if colors[1] == 'yellow':
            return 'green'
        else:
            print("%s is not a primary color." % colors[1])
            
    if colors[0] == 'yellow':
        if colors[1] == 'red':
            return 'orange'
        if colors[1] == 'blue':
            return 'green'
        if colors[1] == 'yellow':
            return 'yellow'
        else:
            print("%s is not a primary color." % colors[1])
            
    else:
        print("%s is not a primary color." % colors[0])

def main():
    print("That makes %s." % mixColors(getColors()))

main()
