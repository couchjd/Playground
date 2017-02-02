import tornado.ioloop
import tornado.web
from tornado import websocket
import os
from sys import exit

clients = []

if os.path.basename(os.getcwd()) != 'datachannel':
    print("cd to /examples/webrtc/datachannel")
    exit()


class MainHandler(tornado.web.RequestHandler):
    def get(req):
        req.render("index.html")

class WebSocketTry(websocket.WebSocketHandler):
    def open(self):
        total = len(clients)+1
        if total > 2:
            self.write_message(str(total))
            self.close()
        else:
            clients.append(self)

    def on_message(self, msg):   
        for client in clients:
            if(client != self):
                client.write_message(msg)

    def on_close(self):
        print("The connection was closed")
        clients.remove(self)

application = tornado.web.Application([
    ("/", MainHandler),
    ("/socket", WebSocketTry),
    ("/static/js/(.*)", tornado.web.StaticFileHandler, {"path": "js/"})
])

application.listen(8081)
tornado.ioloop.IOLoop.instance().start()
