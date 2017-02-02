package characters;

import java.util.Scanner;
import java.util.Random;

public class Player extends Character
{

    private int charClass;
    
    public Player()
    {
        super();
        setClass();
        rollStats();
    }
    
    private String setName()
    {
        Scanner input = new Scanner(System.in);
        System.out.print("Enter your name: ");
        return input.nextLine();
    }
    
    private void setClass()
    {
        int classChoice;
        Scanner input = new Scanner(System.in);
        System.out.println("Choose your class");
        System.out.println("-----------------");
        System.out.println("1. Fighter");
        System.out.println("2. Mage");
        System.out.println("3. Cleric");
        System.out.print("What is your choice? ");
        charClass = input.nextInt();                
    }
    
    private void rollStats()
    {
        Random randGen = new Random();
        String prompt;
        Scanner input = new Scanner(System.in);
        do
        {
            super.setStr(randGen.nextInt(10)+10);
            super.setInt(randGen.nextInt(10)+10);
            super.setWis(randGen.nextInt(10)+10);
            super.setCha(randGen.nextInt(10)+10);
            super.setCon(randGen.nextInt(10)+10);
            
            System.out.println("Str: " + getStr());
            System.out.println("Int: " + getInt());
            System.out.println("Wis: " + getWis());
            System.out.println("Cha: " + getCha());
            System.out.println("Con: " + getCon());
            
            System.out.print("Roll Again? ");
            prompt = input.nextLine();
        }while(prompt.charAt(0) != 'n');
    }
}