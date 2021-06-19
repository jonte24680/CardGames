const card0 = document.getElementById("card0") as HTMLImageElement;
const card1 = document.getElementById("card1") as HTMLImageElement;

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
    room = Room;
    UpdateGui();
});    

function UpdateGui(){
    const player = GetPlayer();
    usernameElement.innerText = player.username;
    moneyElement.innerText = `Money: ${player.money}`;

}

function GetPlayer(){
    var player = room.allPlayers.find(p => p.id == socket.id);
    if(player)
        return player;
    return null;
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