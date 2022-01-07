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

    UpdateGUIStat(room)

    // may be wonrebel to cross site scripting
    playersElement.innerHTML = ""
    room.players.forEach((player) => {
        playersElement.innerHTML += `        <div class="player" style="${player.id == room.gameInfo.turnPlayerId ? "background-color:hsl(119, 100%, 80%);" : ""}">
        <p class="player-name">${player.username}</p>
        <p class="player-money">Money: ${player.money} $</p>
        <p class="player-bet">Bet: ${player.gameStat.bet} $</p>
        <div class="player-card-images">
            ${AddCardImagesToPlayer(player)}
        </div>
    </div>`
    });

    newGameSelectElement.disabled = room.gameInfo.gameName != "NoGameActive"
    newGameButtonElement.disabled = room.gameInfo.gameName != "NoGameActive"
    resetButtonElement.disabled = room.gameInfo.gameName == "NoGameActive"
}

function UpdateGUIStat(room) {
    var statHTML = document.getElementById("stat");

    var cards = document.getElementById("stat-cards");
    var stringCards = "";
    if(room.gameInfo.cards.length > 0){
        room.gameInfo.cards[0].cards.forEach(card => {stringCards += GetCardImagesString(card, "stat-card")});
    }
    cards.innerHTML = stringCards
}

function AddCardImagesToPlayer(player): string{
    // Base <img src=assets/images/Cards/green_back.png" class="player-cards"/>
    var output: string = "";
    player.gameStat.cards.forEach(cardInfo => {
        if(cardInfo.name == "Hand"){
            cardInfo.cards.forEach(card => {
                output += GetCardImagesString(card, "player-cards");
            });
        }
    });
    return output;
}

function GetCardImagesString(card: any, className: string) {
    return `<img src="assets/images/Cards/${CardPath(card)}.png" class="${className}"/>`
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
var resetButtonElement = document.getElementById("reset-button") as HTMLInputElement;

newGameButtonElement.addEventListener("click", () => {
    if(room.gameInfo.turnPlayerId != "")
        return;

    var gameName = newGameSelectElement.value;
    socket.emit("host-new-game", gameName);

});

resetButtonElement.addEventListener("click", () => {
    if(room.gameInfo.gameName != "NoGameActive")
        socket.emit("host-reset");
});

