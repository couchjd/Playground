from rooms import *

class Map:
  def init(self, xMax, yMax):
    self.fillMap(xMax, yMax)
  
  def fillMap(self, xMax, yMax):
    for x in range(0, xMax):
      for y in range (0, yMax):
        
