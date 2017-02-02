#ifndef ROOM_H
#define ROOM_H


class Room{
  public:
    Room();
    virtual ~Room();
    Room* enter();
  protected:
  private:
    Room* north;
    Room* south;
    Room* east;
    Room* west;
};

#endif // ROOM_H
