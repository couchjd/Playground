#ifndef PLAYER_H
#define PLAYER_H

#include <Actor.h>


class Player : public Actor
{
private:
  int xPos;
  int yPos;
  sf::Texture playerTexture;
  sf::Sprite playerSprite;
  enum orientation {left, right};

public:
  orientation facing;
  Player(int x, int y);
  void moveRight(int);
  void moveLeft(int);
  void idle();
  int getXPos();
  int getYPos();
  sf::Sprite getPlayerSprite(){return playerSprite;}
  bool init();
};

#endif // PLAYER_H
