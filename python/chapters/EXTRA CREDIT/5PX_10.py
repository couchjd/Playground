#10 Pound Pattern
def printPound():
	for x in range(6):  #iterates through outer loop
		print('#', end='')  #prints initial # once per line

                #inner loop -- designates number of ' '
		#to be printed per line
		for y in range(x):
			print(' ', end='')  #prints blank spaces
		print('#')  #prints # at end of line

def main():
	printPound()
	
main()
