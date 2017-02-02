package purchase;
import java.util.Scanner;

/**
 Class for the purchase of one kind of item, such as 3 oranges.
 Prices are set supermarket style, such as 5 for $1.25.
*/
public class Purchase
{
    private String name;
    private int groupCount;//Part of price, like the 2 in 2 for $1.99.
    private double groupPrice;
                      //Part of price, like the $1.99 in 2 for $1.99.
    private int numberBought;//Total number being purchased.
    

    public void setName(String newName)
    {
        name = newName;
    }

    /**
     *Sets price to groupCount pieces for $costForCount. E.g., 2 for $1.99.
     * 
     * @param   count costForCount
     */
    public void setPrice(int count, double costForCount)
    {
        if ((count <= 0) || (costForCount <= 0))
        {
            System.out.println("Error: Bad parameter in setPrice.");
            System.exit(0);
        }
        else
        {
            groupCount = count;
            groupPrice = costForCount;
        }
    }
    /**
     *Sets number bought.
     * 
     * @param   number
     */
    public void setNumberBought(int number)
    {
        if (number <= 0)
        {
            System.out.println("Error: Bad parameter in setNumberBought.");
            System.exit(0);
        }
        else
            numberBought = number;
    }      

    /**
     *Gets price and number being purchased from keyboard.
     */
    public void readInput()
    {
        Scanner keyInput = new Scanner (System.in);
	System.out.println("Enter name of item you are purchasing:");
        name = keyInput.nextLine();
        System.out.println("Enter price of item on two lines.");
        System.out.println("For example, 3 for $2.99 is entered as");
        System.out.println("3");
        System.out.println("2.99");
        System.out.println("Enter price of item on two lines, now:");
        groupCount = keyInput.nextInt();
        groupPrice = keyInput.nextDouble();

        while ((groupCount <= 0) || (groupPrice <= 0))
        {
            //Try again:

            System.out.println(
                   "Both numbers must be positive. Try again.");
            System.out.println("Enter price of item on two lines.");
            System.out.println(
                            "For example, 3 for $2.99 is entered as");
            System.out.println("3");
            System.out.println("2.99");
            System.out.println(
                          "Enter price of item on two lines, now:");
            groupCount = keyInput.nextInt();
            groupPrice = keyInput.nextDouble();
        }

        System.out.println("Enter number of items purchased:");
        numberBought = keyInput.nextInt();

        while (numberBought <= 0)
        {
            //Try again:

            System.out.println(
                       "Number must be positive. Try again.");
            System.out.println("Enter number of items purchased:");
            numberBought = keyInput.nextInt();
        }
    }

    /**
     *Outputs price and number being purchased to screen.
     */
    public void writeOutput()
    {
        System.out.print(numberBought + " " + name);
        System.out.println(" purchased at " + groupCount
                                 + " for $" + groupPrice);
    }

    /**
     * Returns name of product
     * 
     * @return name
     */
    public String getName()
    {
        return name;
    }
    

    /**
     * Returns individual unit cost
     * 
     * @return groupPrice/groupCount
     */
    public double getUnitCost()
    {
        return (groupPrice/groupCount);
    }

    /**
     * Returns number bought
     * 
     * @return numberBought
     */
    public int getNumberBought()
    {
        return numberBought;
    }
    
    /**
     * Getter that returns total cost of individual items
     * @return (groupPrice / groupCount) * numberBought;
     */
        public double getTotalCost ()
    {
        return (groupPrice / groupCount) * numberBought;
    }
}