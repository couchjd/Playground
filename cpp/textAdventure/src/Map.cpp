#include "Map.h"

Map::Map(){
  m_mapOrigin = NULL;
  //ctor
}

Map::~Map(){
  //dtor
}

bool Map::buildMap(){
  int row;
  int column;

  Room* thisRoom = m_mapOrigin;             //starting point to build map
  Room* rowStart = NULL;                    //beginning of row for wrapping
  for(row = 0; row < MAP_ROWS; row++){
    rowStart = thisRoom;                    //set to first column
    for(column = 0; column < MAP_COLS; column++){
      thisRoom = new Room;                  //create new room at current point
      thisRoom = thisRoom->east;            //advance pointer to east
    }
    thisRoom->east = rowStart;              //point back to beginning of row
    thisRoom = rowStart->north;             //advance pointer north one row
  }
  return true;
}
