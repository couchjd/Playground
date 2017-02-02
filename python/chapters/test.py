def printRecords():
    with open('golf.txt', 'r') as golf:
        name = golf.readline().rstrip('\n')
        while name != '':
            score = golf.readline().rstrip('\n')

            print('Name: ', name)
            print('Score: ', score)
            print()

            name = golf.readline()

def main():
    printRecords()

main()
