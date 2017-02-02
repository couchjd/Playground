#8 Prime Numbers
def is_prime(number):
    if number == 1 or number == 2:  #1 and 2 are automatically prime
        return True
    else:
        for x in range(2, number):  #checks if a number is prime by comparing
            if number % x == 0:     #the value of the modulus of the number and
                    return False    #all values lower than it to zero
        return True

def main():
    number = int(input("Enter an integer: "))
    prime = is_prime(number)
    if prime == True:
        print("%d is a prime number." % number)
    else:
        print("%d is not a prime number." % number)

main()
