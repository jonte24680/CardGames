const cardsElement = document.getElementById("cards");

var usernameElement = document.getElementById("username");
var moneyElement = document.getElementById("money");

var foldButtonElement = document.getElementById("fold") as HTMLInputElement;
var checkButtonElement = document.getElementById("check") as HTMLInputElement;

var raiseButtonElement = document.getElementById("raise-button") as HTMLInputElement;
var raiseInputElement = document.getElementById("raise-input") as HTMLInputElement;
var raiseValueElement = document.getElementById("raise-value");

document.getElementById("raise-stepUp").addEventListener("click", () => { StepRaiseValue(1)});
document.getElementById("raise-stepDown").addEventListener("click", () => { StepRaiseValue(-1)});

raiseInputElement.addEventListener("change", () => {
    UpdateRaiseValue();
})

function SetRaiseValue(value: number, max: number = Number(raiseInputElement.max), step: number = Number(raiseInputElement.step)){
    raiseInputElement.value = String(value);
    raiseInputElement.max = String(max);
    raiseInputElement.step = String(step);
    UpdateRaiseValue();
}

function StepRaiseValue(value: number){
    if(value >= 1)
        raiseInputElement.stepUp();
    else if(value <= -1)
        raiseInputElement.stepDown();
    UpdateRaiseValue();
}

function UpdateRaiseValue(){
    raiseValueElement.innerText = raiseInputElement.value;
}

SetRaiseValue(0);
var socket = io();

var room;

var joinData = {
    username: getParameterByName("username"),
    roomID: Number(getParameterByName("room"))
};

socket.emit("join-room", joinData);

socket.on("players-update", (Room: any) => {
    console.log(Room);
    if(Room == null)
        ReturnToMainPage(new Error("room dos not exxist"));
    room = Room;
    UpdateGui();
});    

function UpdateGui(){
    const player = GetPlayer();
    usernameElement.innerText = player.username;
    moneyElement.innerText = `Money: ${player.money}`;
    UpdateCards(player)
}

function UpdateCards(player){
    //base <img src="assets/images/Cards/blue_back.png" alt="" id="card0" class="P-card">
    var html: string = "";

    player.gameStat.cards.forEach(cardInfo => {
        if(cardInfo.name == "Hand"){
            cardInfo.cards.forEach(card => {
                if(card == "??")
                    card = "green_back";
                html += `<img src="assets/images/Cards/${card}.png" alt="" class="P-card">`;
            });
        }
    });
    cardsElement.innerHTML = html;
}

function GetPlayer(){
    var player = room.players.find(p => p.id == socket.id);
    if(player)
        return player;
    return null;
}
foldButtonElement.addEventListener("click", () => {
    SendAction("Fold", null);
});

checkButtonElement.addEventListener("click", () => {
    SendAction("Check", null);
});

raiseButtonElement.addEventListener("click", () => {
    SendAction("Raise", {raiseValue: Number(raiseInputElement.value)});
});

function SendAction(action: string, extra: any){
    socket.emit("player-action", {action: action, extra: extra})
}

function ReturnToMainPage(error?: Error) {
    var URL = window.location.origin;
    URL += "?room=" + getParameterByName("room"); 
    URL += error == undefined? "" : `&error="${error.message}"`
    window.location.href = URL;
}


//
//Get query
function getParameterByName(name: string, url: string = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}