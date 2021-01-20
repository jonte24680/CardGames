const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");
const { argv } = require("process");

const StartMoney = 10000;
const littelBlinde = 10;

var rooms = [];

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static floor
app.use(express.static(path.join(__dirname, "Client")));

// Run when a client connect

io.on("connection", socket => {

    socket.on("new-room", roomid => {
        var room;
        if (roomid == "" || roomid == null || rooms.find( arr => arr == roomid) != undefined){
            room = Math.floor(Math.random() * 1000000) + 1
        } else {
            room = Math.floor(roomid);
        }
        socket.join(room);
        rooms.push({room: room, hostid: socket.id});
        socket.emit("players-update", {room: room, users: getRoomUsers(room)});
        console.log(`New card room created white id ${room}`)
    });

    socket.on("join-room", ({username, room}) => {
        const user = userJoin(socket.id ,username, room, StartMoney);
        socket.join(user.room);
        io.emit("players-update", {room: room, users: getRoomUsers(room)});
        console.log(`player ${user.username} (id: ${user.id}) has enterd room ${user.room}`)
    });
    
    socket.emit("message", "Welcome to chatCord!")

});

var PORT = 8080;

if(process.argv.length > 2)
    PORT = process.argv[2];

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));