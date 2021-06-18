var roomidElement = document.getElementsByClassName("info-roomID")[0];
var roomid = Number(prompt("Custume id", "10"))
function ChangeRoomID(id: number){
    roomid = id
    roomidElement.textContent = `RoomId: ${roomid}`
}

var playersElement = document.getElementById("players");

var socket:SocketIOClient.Socket = io();

socket.emit("new-room", roomid);

socket.on("players-update", (room: any) => {
    console.log(room);
    ChangeRoomID(room.roomID)

    playersElement.innerHTML = ""
    room.allPlayers.forEach((player) => {
        playersElement.innerHTML += `        <div class="player">
        <p class="player-name">${player.username}</p>
        <p class="player-money">Money: ${player.money} $</p>
        <p class="player-bet">Bet: ${player.bet} $</p>
        <div class="player-card-images">
            <img src="assets/images/Cards/gray_back.png" class="player-cards"/><img src="assets/images/Cards/QC.png" class="player-cards"/>
        </div>
    </div>`
    });
});


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