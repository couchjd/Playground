package binarytree;

public class BinaryTree 
{
    private Node root;
    
    private static class Node
    {
        Node left;
        Node right;
        int data;
        
        Node(int newData)
        {
            left = null;
            right = null;
            data = newData;
        }
    }//end class Node
    
    public void BinaryTree()
    {
        root = null;
    }
    
    public boolean lookup(int data)
    {
        return lookup(root, data);
    }
    
    private boolean lookup(Node node, int data)
    {
        if(node == null)
            return(false);
        
        if(data==node.data)
            return(true);
        else if(data < node.data)
            return(lookup(node.left, data));
        else
            return(lookup(node.right, data));
    }
    
    public void insert(int data)
    {
        root = insert(root, data);
    }
    
    private Node insert(Node node, int data)
    {
        if(node == null)
            node = new Node(data);
        else
        {
            if(data <= node.data)
                node.left = insert(node.left, data);
            else
                node.right = insert(node.right, data);
        }
        return(node);
    }
}//end class Binary Tree

