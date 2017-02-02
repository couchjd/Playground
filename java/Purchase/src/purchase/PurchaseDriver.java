package purchase;
import java.text.NumberFormat;

public class PurchaseDriver 
{
    public static void main(String[] args)
    {
        double grandTotal = 0.0; 
        NumberFormat currency = NumberFormat.getCurrencyInstance();
        
        Purchase oranges = new Purchase();
        Purchase eggs = new Purchase();
        Purchase apples = new Purchase();
        Purchase watermelons = new Purchase();
        Purchase bagels = new Purchase();

        oranges.readInput();        
        grandTotal += oranges.getTotalCost();
        System.out.println(oranges.getName() + " cost: " 
                + currency.format(oranges.getTotalCost()));
        System.out.println("Total: " + currency.format(grandTotal));
        
        eggs.readInput();
        grandTotal += eggs.getTotalCost();
        System.out.println(eggs.getName() + " cost: " 
                + currency.format(eggs.getTotalCost()));
        System.out.println("Total: " + currency.format(grandTotal));
        
        apples.readInput();
        grandTotal += apples.getTotalCost();
        System.out.println(apples.getName() + " cost: " 
                + currency.format(apples.getTotalCost()));
        System.out.println("Total: " + currency.format(grandTotal));
        
        watermelons.readInput();
        grandTotal += watermelons.getTotalCost();
        System.out.println(watermelons.getName() + " cost: " 
                + currency.format(watermelons.getTotalCost()));
        System.out.println("Total: " + currency.format(grandTotal));
        
        bagels.readInput();
        grandTotal += bagels.getTotalCost();
        System.out.println(bagels.getName() + " cost: " 
                + currency.format(bagels.getTotalCost()));
        System.out.println("Total: " + currency.format(grandTotal));
    }    
}
