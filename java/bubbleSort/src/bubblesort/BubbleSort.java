package bubblesort;
import java.util.*;

public class BubbleSort 
{
   static int num[] = {0, 0, 0, 0, 0};

   static public int[] getNumbers()
   {
       Scanner input = new Scanner(System.in);
       int numbers;
       System.out.print("How many numbers? ");
       numbers = input.nextInt();
       
       for(int x = 0; x < numbers; x++)
       {
           System.out.print("Input number (" + (x+1) + "): ");
           num[x] = input.nextInt();
       }
       return num;
   }
   
   static public int[] sort(int num[])
   {
        boolean flag = true;
        int temp;
        
        while(flag)
        {
            flag = false;
            for(int x = 0; x < num.length-1; x++)
            {
                temp = num[x];
                num[x] = num[x+1];
                num[x+1] = temp;
                flag = true;
            }
        }
        return num;
   }
   
   static public void output(int num[])
   {
       for(int x = 0; x < num.length; x++)
       {
           System.out.print(x + ", ");
       }
   }
   public static void main(String[] args) 
   {
       output(sort(getNumbers()));
   }
}
