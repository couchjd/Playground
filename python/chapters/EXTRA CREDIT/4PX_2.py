#2 Areas of Rectangles
def getInfo():
    length = []
    width = []
    area = []

    for x in range(0, 2):
        length.insert(x, input("Input length of rectangle %d: " % int(x+1)))
        width.insert(x, input("Input width of rectangle %d: " % int(x+1)))
        area.insert(x, int(length[x])*int(width[x]))
    return area
    
def compareArea(area):
    if area[0] > area[1]:
        print("Rectangle 1 is larger than Rectangle 2.")
    elif area[0] < area[1]:
        print("Rectangle 2 is larger than Rectangle 1.")
    elif area[0] == area [1]:
        print("The rectangles are the same size.")
        
def main():
    compareArea(getInfo())
    
main()
