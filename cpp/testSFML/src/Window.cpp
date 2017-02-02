#include "Window.h"

Window::Window()
{
  //ctor
}

/*
Window::~Window()
{
  //dtor
}
*/

void Window::init(sf::RenderWindow* &window){
  sf::RenderWindow window(sf::VideoMode(800, 600), "New Game");
  sf::Texture stage1;
  stage1.loadFromFile("background.png");
  sf::Sprite background;
  background.setTexture(stage1);
}

bool Window::update(sf::RenderWindow &window){
  while(window.isOpen()){
    sf::Event event;
    while(window.pollEvent(event)){
      if(event.type == sf::Event::Closed){
        window.close();
      }
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
      if(sf::Mouse::isButtonPressed(sf::Mouse::Left) && ((sf::Mouse::getPosition().x >= player1.getXPos() &&
                                                            sf::Mouse::getPosition().x < player1.getXPos()+27)) &&
                                                            (sf::Mouse::getPosition().y >= player1.getYPos() &&
                                                             sf::Mouse::getPosition().y < player1.getYPos()+40)){
        window.close();
      }
    }
    window.clear();
    window.draw(background);
    window.draw(player1.getPlayerSprite());
    window.display();
  }
  return true;
}
