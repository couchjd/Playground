#include <cstdlib>
#include <iostream>

using namespace std;
#define SIZE 1073741824

int main(){
  void *front;
  void *rear;
  int test;
  
  front = (void*) malloc(SIZE);
  rear = (double*)front + SIZE;
  
  cout << "Front: " << front << endl;
  cout << "Rear: " << rear << endl;
  
  free(front);
  return 0;
}
