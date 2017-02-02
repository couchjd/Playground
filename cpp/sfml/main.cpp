#include <SFML/Graphics.hpp>
#include <SFML/Audio.hpp>

class Player{
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
  sf::Sprite getPlayerSprite(){return playerSprite;}
};


int main(){
  Player player1(0, 410);
  sf::RenderWindow window(sf::VideoMode(800, 600), "New Game");
  sf::Texture stage1;
  stage1.loadFromFile("background.png");
  sf::Sprite background;
  background.setTexture(stage1);
  sf::Music music;
  music.openFromFile("music.wav");
  music.play();

  while(window.isOpen()){
    sf::Event event;
    while(window.pollEvent(event)){
      if(event.type == sf::Event::Closed)
	window.close();
      if(sf::Keyboard::isKeyPressed(sf::Keyboard::Right)){
	if(sf::Keyboard::isKeyPressed(sf::Keyboard::LShift)){
	  player1.moveRight(12);
	}
	else{
	  player1.moveRight(7);
	}
      }
      else if(sf::Keyboard::isKeyPressed(sf::Keyboard::Left)){
	if(sf::Keyboard::isKeyPressed(sf::Keyboard::LShift)){
	  player1.moveLeft(12);
	}
	else{
	  player1.moveLeft(7);
	}
      }    
    }
    window.clear();
    window.draw(background);
    window.draw(player1.getPlayerSprite());
    window.display();
 }
  return 0;
}

Player::Player(int x, int y){
  xPos = x;
  yPos = y;
  facing = right;
  playerTexture.loadFromFile("mario.png");
  playerSprite.setTexture(playerTexture);
  playerSprite.setTextureRect(sf::IntRect(421, 0, 27, 40));
  playerSprite.setPosition(xPos, yPos);
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
