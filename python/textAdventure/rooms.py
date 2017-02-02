class Room:
    def __init__(self, x, y):
        self.coord = [x, y]
        self.visited = False

    def longDesc(self, x, y):
        print("Long Description: %d, %d" % (x, y))
            
    def shortDesc(self, x, y):
        print("Short Description: %d, %d" % (x, y))

    def roomDesc(self, x, y):
        if self.visited == False:
            self.longDesc(x, y)
            self.visited = True

        elif self.visited == True:
            self.shortDesc(x, y)
                    

