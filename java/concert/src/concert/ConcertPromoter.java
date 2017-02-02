package concert;

import java.util.Scanner;

public class ConcertPromoter 
{
private String bandName;
    private int capacity, tixSold;
    private double phonePrice, dayOfPrice, totalSales;
    private boolean concertToday;
        
    Scanner input = new Scanner(System.in);
    
    public void setBandName(String newBandName)
    {
        bandName = newBandName;
    }
    public void setPhonePrice(double newPhonePrice)
    {
        phonePrice = newPhonePrice;
    }
    public void setDayOfPrice(double newDayOfPrice)
    {
        dayOfPrice = newDayOfPrice;
    }
    public void setCapacity(int newCapacity)
    {
        capacity = newCapacity;
    }
    public void dayOfShow(boolean newStatus)
    {
        concertToday = newStatus;
    }
    public void sellTix(int tixOrder)
    {
        tixSold += tixOrder;
        if(concertToday)
        {
            totalSales += (tixOrder * dayOfPrice);
        }
        else
        {
            totalSales += (tixOrder * phonePrice);
        }
    }
    public int getTixSold()
    {
        return tixSold;
    }
    public int getTixRmng()
    {
        return capacity-tixSold;
    }
    public double getTotalSales()
    {
        return totalSales;
    }
    public int getCapacity()
    {
        return capacity;
    }
    public String getBandName()
    {
        return bandName;
    }
}
