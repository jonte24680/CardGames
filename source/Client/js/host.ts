var socket:SocketIOClient.Socket = io();

var roomid = Number(prompt("Custume id", "10"))

socket.emit("new-room", roomid);

socket.on("players-update", (room: Room) => {
    console.log(room);
});

console.log("host")

/*
function KeyPress(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) alert("Ctrl+z");
}

document.onkeydown = KeyPress;

document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    // do something
  });*/