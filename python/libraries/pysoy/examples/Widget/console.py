from time import sleep
import soy

client = soy.Client()
console = soy.widgets.Console(".","ls")
client.window.append(console)

while client.window:
    sleep(.1)
