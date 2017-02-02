class Password(object):
    def __init__(self):
        self.user = {}
        self.addUser()
        
    def addUser(self):
        username = input("Username: ")
        password = input("Password: ")
        self.user[username] = self.encode(password)

    def saveList(self):
        for name, passwd in self.user.items():
        	f = open('test', 'a')
        	f.write(str(name))
        	f.write(':')
        	f.write(str(passwd))
        	f.write('\n')
        	f.close()
        	
    def readList(self):
    	self.testUser = {}
    	with open('test', 'r') as f:
    		for line in f:
    			items = line.split(':')
    			name, passwd = items[0], int(items[1])
    			self.testUser[name] = passwd
    		for x in self.testUser:
    			print("%s\t%s" % (x, self.testUser[x]))
    		return self.testUser

    			
    def verifyPass(self):
        usertest = input("Username: ")
        if usertest in self.user:
            passtest = self.encode(input("Password: "))
            if passtest == self.user[usertest]:
                print("Access Granted!")
            else:
                print("Password Incorrect.")
        else:
            print("Unknown user.")

    def encode(self, passwd):                   #cast passwd to base-36 int
        return int(bin(int(passwd, 36))[2:])    #then to integer binary
                                                #representation.

    def decode(self, binary, alphabet='0123456789abcdefghijklmnopqrstuvwxyz'):
        base36 = ''                             #accepts a binary encoded
        number = int(str(binary), 2)            #value and returns a string
        if 0 <= number < len(alphabet):
            return alphabet[number]
     
        while number != 0:
            number, i = divmod(number, len(alphabet))
            base36 = alphabet[i] + base36
     
        return base36
