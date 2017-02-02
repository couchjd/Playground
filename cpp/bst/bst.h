#include <cstddef>
#include <iostream>

struct Node{
  int value;
  Node* left;
  Node* right;
};

class bst{
 protected:
  Node* root;
 public:
  bst();
  bool addNode(Node* &root, const int &value);
  bool addNode(const int &value);
  bool printTree(const Node* root) const;
  bool printTree() const;
  bool removeNode(Node* &root, const int &value);
  bool removeNode(const int &value);
};
