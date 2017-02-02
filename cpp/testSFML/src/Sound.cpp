#include "Sound.h"

Sound::Sound(){
  //ctor
}

/*
Sound::~Sound()
{
  //dtor
}
*/

bool Sound::init(){
  sf::Music music;
  music.openFromFile("music.wav");
  music.play();
  return true;
}
