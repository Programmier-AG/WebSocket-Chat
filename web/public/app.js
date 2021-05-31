// WebScoket-Verbindung erstellen / aufbauen
var ws = new WebSocket("ws://0.0.0.0:2222")
var username = ""

// Wenn ein Fehler bei oder mit der WebSocket-Verbindung auftritt
ws.onerror = () => {
    alert("Ein Fehler bei der Verbindung mit dem Server ist aufgetreten!")
}

// Wenn die WebSocket-Verbindung erfolgreich geöffnet wird
ws.onopen = () => {
    document.querySelector("#status").innerText = "Verbunden!"
    document.querySelector("#status").style.color = 'green'
}

// Wenn die WebSocket-Verbindung geschlossen wird
ws.onclose = () => {
    alert("Keine Verbindung zum Server mehr!")
    document.querySelector("#status").innerText = "Keine Verbindung zum Server!"
    document.querySelector("#status").style.color = 'red'
}

// Funktion, die ausgelöst wird, wenn auf den 'Beitreten' Knopf gedrückt wird
// Liest den Input aus und meldet den Nutzer entsprechend beim Socket-Server
// (über die bereits vorhandene Verbindung) an
const login = () => {
    username = document.querySelector("#username").value
    if(username == "") {
        alert("Bitte gib einen gültigen Nutzernamen an.")
        return
    }

    ws.send("join///" + username)
    document.querySelector("#join-form").style.display = "none"
    document.querySelector("#chat-form").style.display = "block"
    document.querySelector("#userstatus").innerText = "Eingeloggt als " + username
    document.querySelector("#userstatus").style.color = 'green'
}

// Eine Funktion, die ausgelöst wird, wenn der 'Abschicken' Knopf gedrückt wird
// Sendet die eingegebene Nachricht an den Socket-Server und leert den Input
const sendmessage = () => {
    message = document.querySelector("#message").value
    ws.send("message///" + username + "///" + message)
    document.querySelector("#message").value = ""
}

// Wenn eine Nachricht über die WebSocket-Verbindung empfangen wird
ws.onmessage = event => {
    console.log(event)
    var author = event.data.split(">>>")[0]
    var message = event.data.split(">>>").slice(1)
    var messages = document.querySelector("#messages")

    // Die Nachricht als HTML-Element zum '#messages' div-Element hinzufügen
    messages.innerHTML += `
        <div class="message">
            <h3 class="message-author">${author}</h3>
            <p class="message-content">
                ${message}
            </p>
        </div>
    `;

    // Ans Ende des div-Elements mit allen Nachrichten scrollen
    messages.scrollTop = messages.scrollHeight
}