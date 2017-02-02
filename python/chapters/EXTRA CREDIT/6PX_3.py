#3 Maximum of Two Values
def compare(intOne, intTwo):    #compares two integers and returns the one
    if intOne > intTwo:         #with the highest value
        return intOne
    else:
        return intTwo

def main():
    print("%d is the greater value." % 
          compare(int(input("Enter first number: ")),
                  int(input("Enter second number: "))))

main()
