from password import *

def main():
	test = {}
	password = Password()
	for x in password.user:
		print("%s\n%d" % (x, password.user[x]))
	password.verifyPass()
	password.saveList()
	test = password.readList()
	print(test)
main()
