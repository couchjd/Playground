#5 Kinetic Energy
def kinetic_energy(mass, velocity):
    kEnergy = ((1/2)*mass*velocity**2)  #calculates kinetic energy, given a
    return kEnergy                      #mass and velocity

def main():
    print("The kinetic energy is %.2f joules." %
          kinetic_energy(float(input("Enter mass of object: ")),
                         float(input("Enter velocity of object: "))))

main()
