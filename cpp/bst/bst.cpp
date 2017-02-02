#include "bst.h"

using namespace std;

bst::bst(){
  root = NULL;
}

bool bst::addNode(Node* &rootNode, const int &value){
  if(rootNode == NULL){
    rootNode = new Node;
    rootNode->value = value;
    rootNode->left = NULL;
    rootNode->right = NULL;
    return true;
  }
  else if(value < rootNode->value){
    addNode(rootNode->left, value);
  }
  else if(value > rootNode->value){
    addNode(rootNode->right, value);
  }
  return false;
}

bool bst::addNode(const int &value){
  if(root == NULL){
    root = new Node;
    root->value = value;
    root->left = NULL;
    root->right = NULL;
    return true;
  }
  else if(value < root->value){
    addNode(root->left, value);
  }
  else if(value > root->value){
    addNode(root->right, value);
  }
  return false;
}

bool bst::printTree(const Node* rootNode) const{
  if(!rootNode){
    return false;
  }
  printTree(rootNode->left);
  cout << rootNode->value << " ";
  printTree(rootNode->right);
}

bool bst::printTree() const{
  if(!root){
    return false;
  }
  printTree(root->left);
  cout << root->value << " ";
  printTree(root->right);
}

bool bst::removeNode(Node* &vertex, Node* &parent, const int &value){
  if(vertex->value == value){
    if(vertex->left == NULL && vertex->right == NULL){ //If vertex is a leaf
      delete vertex;
      root = NULL;
    }
    else if(vertex->left == NULL && vertex->right != NULL){
      removeNode(vertex->right, vertex, value);
    }
    else if(vertex->right == NULL && vertex->left != NULL){
      removeNode(vertex->left, vertex, value);
    }
  }//if(vertex->value == value)
}

bool bst::removeNode(const int &value){
  Node* vertex = root;
  Node* parent = root;
  if(vertex->value == value){
    if(vertex->left == NULL && vertex->right == NULL){ //If vertex is a leaf
      delete vertex;
      root = NULL;
    }
    else{
      removeNode(vertex, parent, value);
    }
  }//if(vertex->value == value)
}
