#include "Game.h"

Game::Game(){
    //ctor
}

/*
Game::~Game()
{
    //dtor
}
*/

bool Game::init(){
  Player    player1(0, 410);
  Window    *gameWindow;
  Sound     gameSound;

  gameWindow->init(gameWindow);
  gameSound.init();

  return true;

}

bool Game::update(){

}
