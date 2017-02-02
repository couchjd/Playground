#ifndef MAP_H
#define MAP_H

#include <cstddef>
#include "Room.h"

#define MAP_ROWS 4;
#define MAP_COLS 4;

class Map{
  public:
    Map();
    virtual ~Map();
  protected:

  private:
    Room* m_mapOrigin;
    bool buildMap();
};

#endif // MAP_H
