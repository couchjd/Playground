numberOfPairs = int(input("How many pairs of values are to be entered? "))
pairsRead = 0

while pairsRead < numberOfPairs:
    number1, number2 = input("Enter two numbers separated by a blank"
                             " then press enter: ").split()
    if int(number1) < int(number2):
        print(number1, 'is less than', number2)
    else:
        print(number2, 'is less than', number1)
    pairsRead+=1
        
