#include "Player.h"

Player::Player(int x, int y){
    xPos = x;
    yPos = y;
    facing = right;
    playerTexture.loadFromFile("mario.png");
    playerSprite.setTexture(playerTexture);
    playerSprite.setTextureRect(sf::IntRect(421, 0, 27, 40));
    playerSprite.setPosition(xPos, yPos);
}

/*Player::~Player()
{
    //dtor
}
*/

bool Player::init(){
  return true;
}
void Player::moveRight(int moveSpeed){
    facing = right;
    xPos += moveSpeed;
    if((xPos/10)%2 == 0)
        playerSprite.setTextureRect(sf::IntRect(659, 0, 27, 40));
    else
        playerSprite.setTextureRect(sf::IntRect(421, 0, 27, 40));
    playerSprite.setPosition(xPos, yPos);
}

void Player::moveLeft(int moveSpeed){
    facing = left;
    xPos -= moveSpeed;
    if((xPos/10)%2 == 0)
        playerSprite.setTextureRect(sf::IntRect(99, 0, 27, 40));
    else
        playerSprite.setTextureRect(sf::IntRect(339, 0, 27, 40));
    playerSprite.setPosition(xPos, yPos);
}

void Player::idle(){
    if(facing == right)
        playerSprite.setTextureRect(sf::IntRect(421, 0, 27, 40));
    else
        playerSprite.setTextureRect(sf::IntRect(339, 0, 27, 40));
}

int Player::getXPos(){
    return xPos;
}

int Player::getYPos(){
    return yPos;
}
