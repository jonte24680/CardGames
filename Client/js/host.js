var socket = io();

const roomid = prompt("Custume id", 10)

socket.emit("new-room", roomid);

socket.on("room-info", (roomid) => {

});

socket.on("players-update", ({room, users}) => {
    console.log(room);
    console.log(users);
});

console.log("host")

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
  });