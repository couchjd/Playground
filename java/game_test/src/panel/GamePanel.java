package panel;

import java.awt.Color;
import java.awt.Dimension;
import javax.swing.JPanel;


public class GamePanel extends JPanel implements Runnable
{
    private static final int PWIDTH = 500;
    private static final int PHEIGHT = 400;
    
    private Thread animator;
    private volatile boolean running = false;
    
    private volatile boolean gameOver = false;
    
    public GamePanel()
    {
        setBackground(Color.white);
        setPreferredSize(new Dimension(PWIDTH, PHEIGHT));
    }
    
    @Override
    public void addNotify()
    {
        super.addNotify();
        startGame();
    }
    
    private void startGame()
    {
        if(animator == null || !running)
        {
            animator = new Thread(this);
            animator.start();
        }
    }
    
    public void stopGame()
    {
        running = false;
    }
    
    public void run()
    {
        running = true;
        while(running)
        {
            gameUpdate();
            gameRender();
            repaint();
            
            try
            {
                Thread.sleep(20);
            }
            catch(InterruptedException ex)
            {
            }
            System.exit(0);
        }
    }
    
    private void gameUpdate()
    {
        if(!gameOver)
        {
        }
    }
    private void gameRender()
    {
    }
}
