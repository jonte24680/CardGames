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