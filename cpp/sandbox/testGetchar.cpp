#include <stdio.h>
#include <iostream>


using namespace std;

int main(){
  int c;
  
  c = getchar();
  while(c != 'x'){
    puts("Pressed: ");
    putchar(c);
    
    c = getchar();
  }
}
