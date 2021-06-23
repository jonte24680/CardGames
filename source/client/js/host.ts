var roomidElement = document.getElementsByClassName("info-roomID")[0];
var roomid = Number(prompt("Custume id", "10"))

var room;

var playersElement = document.getElementById("players");

var socket:SocketIOClient.Socket = io();

socket.emit("new-room", roomid);

socket.on("players-update", (Room: any) => {
    room = Room;
    console.log(Room);
    
    UpdateGUI();
    
});

function UpdateGUI(){
    roomidElement.textContent = `RoomId: ${room.roomID}`

    playersElement.innerHTML = ""
    room.players.forEach((player) => {
        playersElement.innerHTML += `        <div class="player">
        <p class="player-name">${player.username}</p>
        <p class="player-money">Money: ${player.money} $</p>
        <p class="player-bet">Bet: ${player.gameStat.bet} $</p>
        <div class="player-card-images">
            ${AddCardImages(player)}
        </div>
    </div>`
    });
}

function AddCardImages(player): string{
    // Base <img src=assets/images/Cards/green_back.png" class="player-cards"/>
    var output: string = "";
    player.gameStat.cards.forEach(cardInfo => {
        if(cardInfo.name == "Hand"){
            cardInfo.cards.forEach(card => {
                output += `<img src="assets/images/Cards/${CardPath(card)}.png" class="player-cards"/>`
            });
        }
    });
    return output;
}

function CardPath(card: string): string{
    if(card == "??")
        return "green_back";
    return card;
}

//
// Start new Game

var newGameSelectElement = document.getElementById("new-game-select") as HTMLSelectElement;
var newGameButtonElement = document.getElementById("new-game-button") as HTMLInputElement;

newGameButtonElement.addEventListener("click", () => {
    if(room.gameInfo.gameName != "NoGameActive")
        return;

    var gameName = newGameSelectElement.value;
    socket.emit("host-new-game", gameName);

});