var socket = io();

const card0 = document.getElementById("card0");
const card1 = document.getElementById("card1");


var joinData = {username: getParameterByName("username"), roomID: Number(getParameterByName("room"))}

const room = getParameterByName("room")

socket.emit("join-room", joinData);

socket.on("players-update", (room: any) => {
    console.log(room);
});


console.log("hej")

var raiseElement = document.getElementById("raise");
var valueRaiseElement = document.getElementById("value-raise");

if (raiseElement != null){
    raiseElement.addEventListener("change", () => {
        if (raiseElement != null && valueRaiseElement != null)
            valueRaiseElement.innerText = raiseElement.innerText ;
    })
}

//
//Get query
function getParameterByName(name:string, url:string = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}