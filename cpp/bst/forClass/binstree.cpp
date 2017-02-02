/**
 * binstree.cpp implements the methods of a binary search tree class.
 *
 * @author Jeff Couch (couch009@cougars.csusm.edu)
 * @version v1.0
 * @since 03.20.2015
 *
 **/
#include "binstree.h"
#include <iostream>
#include <cstddef> //Included for definition of NULL

using namespace std;

// constructor initializes Root
BST::BST(){
  Root = NULL;   // This is an empty tree
}

// destructor must completely destroy the tree
BST::~BST(){
  cout << "Destructor being called." << endl;
  dtraverse(Root); // traverse to delete all vertices in post order
  Root = NULL;    
}

/**
 * dtraverse() performs a post-order traversal of the tree and 
 * destroys all vertices.
 *
 * @param Vertex* V -- pointer to vertex to be deleted
 *
 **/
void BST::dtraverse(Vertex *V){  // post order traversal
  if (V != NULL){
    dtraverse(V->Left);         // visit left sub tree of V
    dtraverse(V->Right);       // visit right sub tree of V
    delete V;                  // deletes V
  }
}

/**
 * ShowInOrder() performs an in-order traversal of the tree
 *   and prints them to the standard output
 *
 **/
void BST::ShowInOrder(){
  cout << "Elements in the IN order: " << endl;
  INorderTraversal(Root);  // start in-order traversal from the root
}

/**
 * INorderTraversal performs an in-order traversal of the tree
 *   and prints each element.
 *
 * @param Vertex* V -- pointer to current vertex.
 *
 **/
void BST::INorderTraversal(Vertex *V){
  if (V != NULL){
    INorderTraversal(V->Left);
    cout << V->Elem << " ";
    INorderTraversal(V->Right);
  }
  cout << endl;
}

/**
 * ShowPreOrder() performs pre-order traversal of the tree
 *   and prints them to the standard output.
 *
 **/
void BST::ShowPreOrder(){
  cout << "Elements in the PRE order:" << endl;
  PREorderTraversal(Root);  // start pre-order traversal from the root
}

/**
 * PREorderTraversal performs a pre-order traversal of the tree
 *   and prints each element.
 *
 * @param Vertex* V -- pointer to current vertex.
 *
 **/
void BST::PREorderTraversal(Vertex *V){
  if (V != NULL){
    cout << V->Elem;
    PREorderTraversal(V->Left);
    PREorderTraversal(V->Right);
  }
  cout << endl;
}

/**
 * PURPOSE: Adds a vertex to the binary search tree for new element 
 * @param elem_t E -- the new element E
 * ALGORITHM: We will do this iteratively (not recursively)
 *     - smaller than the current -> go to the left
 *     - bigger than the current  -> go to the right
 *    - cannot go any further    -> add it there
 *
 **/
void BST::Insertvertex(elem_t E){
  Vertex *N;       // N will point to the new vertex to be inserted
  N = new Vertex;        // a new vertex is created
  N->Left  = NULL;     // make sure it does not
  N->Right = NULL;    // point to anything
  N->Elem  = E;            // put element E in it
  cout << "Trying to insert " << E << endl;
  if (Root == NULL){  // Special case: we have a brand new empty tree
      Root = N;      // the new vertex is added as the root
      cout << "...adding " << E << " as the root" << endl; 
  }
  else{  // the tree is not empty
    Vertex *V;       // V will point to the current vertex
    Vertex *Parent;  // Parent will point to V's parent
    V = Root;        // start with the root as V
    while (V != NULL){  // go down the tree until you cannot go any further
      if (N->Elem == V->Elem){ // special case
	cout << "...error: the element already exists" << endl;
	return;  
      }
      else{
	if (N->Elem < V->Elem){  // what I have is smaller than V
	  cout << "...going to the left" << endl; 
	  Parent = V;
	  V = V->Left; 
	}
	else{ // what I have is bigger than V
	  cout << "...going to the right" << endl;
	  Parent = V;
	  V = V->Right;
	}
      }
    }//end of while
    // reached NULL -- Must add N as the Parent's child
    if (N->Elem < Parent->Elem){  
      Parent->Left = N;
      cout << "...adding " << E << " as the left child of " 
	   << Parent->Elem << endl;}
    else{
      Parent->Right = N;
      cout << "...adding " << E << " as the right child of " 
	   << Parent->Elem << endl;
    }
  }// end of normal case
}// end of InsertVertex


// PURPOSE: Deletes a vertex that has E as its element.
// PARAM: element E to be removed
// ALGORITHM: First we must find the vertex then call Remove
void BST::DeleteVertex(elem_t E){
  cout << "Trying to delete " << E << endl;
  Vertex *V;              // the current vertex
  Vertex *Parent = NULL;  // its parent
  if ((E == Root->Elem) && (Root->Left == NULL) && (Root->Right == NULL)){
    cout << "...deleting the lonely root" << endl;
    delete Root; 
    Root = NULL;
    return; 
  }  // only the Root was there and deleted it

  else if(V == Root){
    if(V->Right == NULL && V->Left != NULL){
      V->Left = Root;
      Root = V->Left;
      return;
    }
    else if(V->Left == NULL && V->Right != NULL){
      V->Right = Root;
      Root = V->Left;
      return;
    }
    else{
      cout << "Not found" << endl;
      return;
    }
 }
  
  // Otherwise deleting something else
  V = Root;  // start with the root to look for E
  while (V != NULL){ 
    if ( E == V->Elem){   // found it
      cout << "...removing " << V->Elem << endl;
      remove(V, Parent);
      return; 
    }
    else if (E < V->Elem){
      cout << "...going to the left" << endl;
      Parent = V;
      V = V->Left;
      // ** update Parent and V here to go down 
    }
    else{  
      cout << "...going to the right" << endl;
      // ** update Parent and V here to go down
      Parent = V;
      V = V->Right;
    }
  }// end of while
  // reached NULL  -- did not find it
  cout << "Did not find the key in the tree." << endl;
}// end of DeleteVertex


void BST::remove(Vertex *V, Vertex *P){
  //if V is a leaf
  if(V->Left == NULL && V->Right == NULL){
    cout << ".. removing a leaf" << endl;
    if(P->Left == V){                // If V is a left child of P
      delete V;
      P->Left = NULL;
    }
    else{                            // V is a right child of P
      delete V;
      P->Right = NULL;
    }
  }
  //if V has just a left child
  else if(V->Left != NULL && V->Right == NULL){
    cout << "removing a vertex with just the left child" << endl;
    if(V==Root){
      P=V;                          
      P->Left=V->Left;              
      Root=P->Left;                 
      delete V;
      V = NULL;                     
    }
    else if(P->Left==V->Left){      
      P->Left = V->Left;            
      delete V;
      V = NULL;                     
    }
    else{                           
      P->Right = V->Left;
      delete V;
      V=NULL;
    }
  }
  //If V has just a right child
  else if(V->Left == NULL && V->Right != NULL){
    cout << "removing a vertex with just the right child" << endl;
    if(V==Root){                      
      P=V;                         
      P->Right=V->Right;           
      Root=P->Right;               
      delete V;
      V=NULL;                      
    }
    else if (P->Right==V->Right){  
      P->Right=V->Right;           
      delete V;
      V=NULL;
    }
    else{                          
      P->Left=V->Right;
      delete V;
      V=NULL;
    }
  }
  //V has two children
  else{
    cout << "...removing an internal vertex with children" << endl;
    cout << ".....find the MAX of its left sub-tree" << endl;
    elem_t Melem;
    Melem = findMax(V);          // find MAX element in the left sub-tree of V
    cout << ".....replacing " << V->Elem << " with " << Melem << endl;
    V->Elem = Melem;             // Replace V's element with Melem here
  }
}// end of remove



/**
 * findMax() searches the tree recursively for the largest value
 *   and returns it.
 *
 * @param Vertex* V -- Vertex of current tree/subtree to be searched
 * @return -- largest value in the subtree.
 *
 **/
elem_t BST::findMax(Vertex *V){
  Vertex *Parent = V;
  V = V->Left;               // start with the left child of V
  
  while(V->Right!= NULL){     // While the right child of V is still available
    Parent = V;
    V = V->Right; 
  }
  // reached NULL Right  -- V now has the MAX element
  elem_t X = V->Elem;
  cout << ".....Max is " << X << endl;
  remove(V, Parent);    // remove the MAX vertex 
  return X;             // return the MAX element 
}// end of FindMax
