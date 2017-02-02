#ifndef WINDOW_H
#define WINDOW_H

#include <SFML/Graphics.hpp>

class Window
{
public:
  Window();
  //virtual ~Window();
  void init(sf::RenderWindow* &window);
  bool update(sf::RenderWindow &window);

protected:
private:
};

#endif // WINDOW_H
