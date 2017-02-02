#ifndef MAZEBIT_H
#define MAZEBIT_H

class mazeBit
{
  public:
    mazeBit();
    virtual ~mazeBit();
    virtual mazeBit* enter() = 0;
  protected:
  private:
};

#endif // MAZEBIT_H
