#2 Calories Burned
def caloriesBurned():
    CAL_PER_MIN = 3.9
    TIME = [10, 15, 20, 35, 30]

    #prints calories burned for each value in TIME
    for x in TIME:
        print("%.2f calories burned in %d minutes." %
                      ((x * CAL_PER_MIN), x))

def main():
    caloriesBurned()
    
main()
