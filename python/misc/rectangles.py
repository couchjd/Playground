class Rectangle:
    def __init__(self, x):
        self.id = x
        self.getInfo()
        
    def getInfo(self):
        self.length = (input("Input length of rectangle %d: " % self.id))
        self.width = (input("Input width of rectangle %d: " % self.id))

    def getArea(self):
        return int(self.length)*int(self.width)
    
def compareArea(a, b):
    if a.getArea() > b.getArea():
        print("Rectangle %d is larger than Rectangle %d." % (a.id, b.id))
    elif a.getArea() < b.getArea():
        print("Rectangle %d is larger than Rectangle %d." % (b.id, a.id))
    elif a.getArea() == b.getArea():
        print("The rectangles are the same size.")
        
def main():
    rect = []
    for x in range(0, 2):
        rect.insert(x, Rectangle(x+1))
    compareArea(rect[0], rect[1])
    
main()
