#include "Game.h"

int main(){
  Game game;
  game.init();

  while(true){
    game.update();
  }
  return 0;
}
