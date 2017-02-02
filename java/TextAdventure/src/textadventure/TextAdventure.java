package textadventure;
import characters.*;
import world.*;
import update.*;
import parser.*;

public class TextAdventure
{
    public static void main(String[] args)
    {
        WorldMap world = new WorldMap();
        Player player = new Player(world);
        Update updater = new Update();
        Parser parser = new Parser(player, world);

        world.playerInit(player);
        
        boolean run = true;
        while(run == true)
        {
            updater.updateStats(player);
            run = parser.getCommand();
        }
    }
}
