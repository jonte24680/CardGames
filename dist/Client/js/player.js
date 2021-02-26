var socket = io();

const card0 = document.getElementById("card0");
const card1 = document.getElementById("card1");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
});

socket.emit("join-room", {username, room});

socket.on("username", ({type, data}) => {

});

console.log("hej")