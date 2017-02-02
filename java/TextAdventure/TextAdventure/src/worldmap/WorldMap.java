package worldmap;

public class WorldMap 
{
    public WorldMap()
    {
        fillMap(5,5);
    }
    
    private void fillMap(int xSize, int ySize)
    {
        
    }
    
    public class Room
    {
        private int xPos;
        private int yPos;
        
        public Room()
        {
            xPos = 0;
            yPos = 0;
        }
        public Room(int x, int y)
        {
            xPos = x;
            yPos = y;
        }
        public int getxPos()
        {
            return xPos;
        }

        public int getyPos()
        {
            return yPos;
        }

        public void setxPos(int xPos)
        {
            this.xPos = xPos;
        }

        public void setyPos(int yPos)
        {
            this.yPos = yPos;
        }
        
        public String shortDescription()
        {
            return(xPos + "," + yPos + " short description.");
        }
        public String longDescription()
        {
            return(xPos + "," + yPos + " long description.");
        }
    }
}
