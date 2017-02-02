#6 Driver's License Exam
def checkScore(answerKey, studentAnswers):
    results, incorrect, results['correct'], count = {}, {}, 0, 0
    for x in answerKey:
        if answerKey[count] == studentAnswers[count]:
            results['correct'] += 1
        else:
            incorrect[count] = studentAnswers[count]
        count += 1
    results['incorrect'], results['count'] = incorrect, count
    return results
    
def main():
    key = ['b', 'd', 'a', 'a', 'c', 'a', 'b', 'a', 'c', 'd',
           'b', 'c', 'd', 'a', 'd', 'c', 'c', 'b', 'd', 'a']

    with open('student.txt', 'r') as studentFile:
        student = studentFile.read().split()
        results = checkScore(key, student)
        incorrect = results['incorrect']
    print("Correct: %d/%d" % (results['correct'], results['count']))
    print("Incorrect: ")
    print("#    Your    Correct")
    print("    Answer    Answer")
    for x in incorrect:
        print("%d\t%s\t%s" % (x+1, incorrect[x], key[x]))

main()

