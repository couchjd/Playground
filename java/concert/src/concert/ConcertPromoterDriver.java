package concert;
/** This is the Driver class for ConcertPromoter
 *
 * @author Rick Cassoni, rcassoni@palomar.edu
 * @version v1.0
 * @since 2/18/2012
 */
public class ConcertPromoterDriver {
    public static void main (String args[]){
        System.out.println("Wow did you hear John Mayer is coming to Belly Up");
        System.out.println("Its a quaint event with only 20 tix to be sold\n"
                + "and you are in charge of selling all 20 tix\n");
        
        ConcertPromoter johnMayer = new ConcertPromoter();
        johnMayer.setBandName("John Mayer");
        johnMayer.setPhonePrice(79.99);
        johnMayer.setDayOfPrice(99.99);
        johnMayer.setCapacity (20);
        System.out.println("Let's get selling those tix!\n");
        
        //First order
        System.out.println("Wow, first order with 8 tix");
        johnMayer.sellTix(8);
        System.out.println (johnMayer.getTixSold() + " tix sold.\n"
                + "Only " + johnMayer.getTixRmng() + " left to sell.\n");
        
        //2nd order
        System.out.println("Another order.  4 tix this time.");
        johnMayer.sellTix(4);
        System.out.println (johnMayer.getTixSold() + " tix sold.\n"
        + "Only " + johnMayer.getTixRmng() + " left to sell.\n");
        
        //Day of show
        System.out.println("Day of the show.");
        johnMayer.dayOfShow(true);
        
        //Third order
        System.out.println("Another order.  6 tix this time.");
        johnMayer.sellTix(6);
        System.out.println (johnMayer.getTixSold() + " tix sold.\n"
        + "Only " + johnMayer.getTixRmng() + " left to sell.\n");
        
        //Last order
        System.out.println("Two tix left, I am snagging one.");
        johnMayer.sellTix(1);
        System.out.println (johnMayer.getTixSold() + " tix sold.\n"
        + "Only " + johnMayer.getTixRmng() + " left to sell.\n");
        
        //Show Time
        System.out.printf("Looks like we sold %2d out of %2d tix.\n" + 
                "For the %s concert\n" + "And made $%.2f from tix sales\n",  
                johnMayer.getTixSold(), johnMayer.getCapacity(), 
                johnMayer.getBandName(), johnMayer.getTotalSales());
        
        //Next Show
        System.out.println("\n\nNice work. Let's do another show.  Sure who\n"
                + "it's Maroon5 with that guy from the Voice, you must mean\n"
                + "Adam Levine");
        
        System.out.println("\n\nThis time, we're going to try to sell 30 tix.\n");
        
        ConcertPromoter m5 = new ConcertPromoter();
        m5.setBandName("Maroon5");
        m5.setPhonePrice(81.99); //$81.99 phone price
        m5.setDayOfPrice(105.99); //$105.99 day of price
        m5.setCapacity (30);
        System.out.println("Let's get selling those tix!\n");
        
        //First order
        System.out.println("First order with 4 tix");
        m5.sellTix(4);
        System.out.println (m5.getTixSold() + " tix sold.\n"
                + "Only " + m5.getTixRmng() + " left to sell.\n");
        
        //2nd order
        System.out.println("Another order.  12 tix this time.");
        m5.sellTix(12);
        System.out.println (m5.getTixSold() + " tix sold.\n"
        + "Only " + m5.getTixRmng() + " left to sell.\n");
        
        //Day of show
        System.out.println("Day of the show.");
        m5.dayOfShow(true);
        
        //Third order
        System.out.println("Another order.  7 tix this time.");
        m5.sellTix(7);
        System.out.println (m5.getTixSold() + " tix sold.\n"
        + "Only " + m5.getTixRmng() + " left to sell.\n");
        
        //Fourth order
        System.out.println("Another order.  2 tix this time.");
        m5.sellTix(2);
        System.out.println (m5.getTixSold() + " tix sold.\n"
        + "Only " + m5.getTixRmng() + " left to sell.\n");
        
        //Last order
        System.out.println("Five tix left, I am snagging one.");
        m5.sellTix(1);
        System.out.println (m5.getTixSold() + " tix sold.\n"
        + "Only " + m5.getTixRmng() + " left to sell.\n");
        
        //Show Time
        System.out.printf("Looks like we sold %2d out of %2d tix.\n" + 
                "For the %s concert\n" + "And made $%.2f from tix sales\n",  
                m5.getTixSold(), m5.getCapacity(), m5.getBandName(),
                m5.getTotalSales());
    
    } //end main   
} //end class
