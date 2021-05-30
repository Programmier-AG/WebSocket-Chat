import _thread as thread
import logging
import time

from flask import Flask
from flask.templating import render_template
from websocket_server import WebsocketServer

app = Flask("WebSocket-Chat", template_folder='web')
app.config["TEMPLATES_AUTO_RELOAD"] = True

#############################
#         FRONT-END         #
#############################

def webserver():
    @app.route("/")
    def index():
        return render_template("index.html")
    
    app.run("0.0.0.0", 80)

############################
#         BACK-END         #
############################

def websocket_server():
    # Eine Liste mit Dictonaries, die den Nutzernamen im Key und den Client im Value hat
    # um zu wissen, welcher Client zu welchem Nutzernamen gehört
    clients = {}

    def handle_command(client, server, message):
        # Message-Aufbau : command///arg1///arg2///arg3
        command = message.split("///")[0]
        args = message.split("///")[1:]

        print(command, args)

        if command == "join":
            # clients = {client: "nutzername"}
            clients[args[0]] = client
        if command == "message":
            user = ""
            for username, client_ in clients.items():
                if client_ == client:
                    user = username
                    break
            
            message = " ".join(args[1:])
            # Wird an alle Nutzer (die online sind) geschickt
            # 'nutzername>>>nachricht'
            server.send_message_to_all(f"{user}>>>{message}")
        else:
            return

    ws_server = WebsocketServer(2222, host="0.0.0.0", loglevel=logging.INFO)
    
    # Eigentliche Möglichkeit, eine Funktion auszulösen, wenn ein neuer Client
    # beitritt, allerdings kann hier keine Nachricht angehängt werden, die z. B.
    # einen Nutzernamen enthält, weshalb in diesem Beispiel eine Nachricht mit
    # 'join//username' als Join-Event gezählt wird.
    # ws_server.set_fn_new_client(user_joined)
    
    # Funktion, die ausgeführt wird, wenn der Server eine Nachricht über
    # den WebSocket empfängt
    ws_server.set_fn_message_received(handle_command)

    ws_server.run_forever()

thread.start_new_thread(webserver, ())
thread.start_new_thread(websocket_server, ())

while True:
    time.sleep(1000)
