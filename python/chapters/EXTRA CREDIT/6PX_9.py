#9 Prime Number List
def is_prime(number):
    if number == 1 or number == 2:  #1 and 2 are automatically prime
        return True
    else:
        for x in range(2, number):  #checks if a number is prime by comparing
            if number % x == 0:     #the value of the modulus of the number and
                    return False    #all values lower than it to zero
        return True

def main():
    for x in range(1, 101):         #iterates over all numbers from 1-100 and 
        if is_prime(x) == True:     #prints each prime number
            print(x)

main()
