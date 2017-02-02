def getInput():
    userInput = input("What will you do? ").split()
   
    userAction = {}
    userAction['verb'] = findVerb(userInput)
    userAction['article'] = findArticle(userInput)
		
    return userAction

def findVerb(userInput):
    with open('action', 'r') as verbFile:
        VERB = verbFile.read().split()

        for x in userInput:
            if x in VERB:
                verb = x
                break
            else:
                verb = ''
        return verb
    
def findArticle(userInput):
    with open('article', 'r') as articleFile:
        ARTICLE = articleFile.read().split()

        for x in userInput:
            if x in ARTICLE:
                article = x
                break
            else:
                article = ''
        return article
