#ifndef GAME_H
#define GAME_H

#include "Game.h"
#include "Player.h"
#include "Sound.h"
#include "Window.h"

class Game{
public :
  Game();
  //virtual ~Game();
  bool init();
  bool update();

protected:
private:
};

#endif // GAME_H
