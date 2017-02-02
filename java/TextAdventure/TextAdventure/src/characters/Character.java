package characters;

import java.util.Random;

public class Character 
{
    private String name;
    private int str;
    private int intel;
    private int wis;
    private int chrs;
    private int con;
    private int maxHP;
    private int currHP;
    
    /**
     * Default constructor
     * 
     */
    public Character()
    {
        name = "No Name";
        rollHP();
        rollStats();
    }
    
    /**
     * Constructor
     * 
     * @param inName 
     * 
     */
    public Character(String inName)
    {
        name = inName;
        rollHP();
    }
    
    /**
     * 
     */
    private void rollHP()
    {
       Random randGen = new Random();
       maxHP = (randGen.nextInt(10))+10;
       currHP = maxHP;
    }
    
    private void rollStats()
    {
        Random randGen = new Random();
        str = randGen.nextInt(10)+10;
        intel = randGen.nextInt(10)+10;
        wis = randGen.nextInt(10)+10;
        chrs = randGen.nextInt(10)+10;
        con = randGen.nextInt(10)+10;
    }
    
    public void setStr(int inStr)
    {
        str = inStr;
    }
    
    public void setInt(int inInt)
    {
        intel = inInt;
    }
    
    public void setWis(int inWis)
    {
        wis = inWis;
    }
    
    public void setCha(int inCha)
    {
        chrs = inCha;
    }
    
    public void setCon(int inCon)
    {
        con = inCon;
    }
    
    public int getStr()
    {
        return str;
    }
    
    public int getInt()
    {
        return intel;
    }
    
    public int getWis()
    {
        return wis;
    }
    
    public int getCha()
    {
        return chrs;
    }
    
    public int getCon()
    {
        return con;
    }
}
