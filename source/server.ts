import path from "path";
import http from "http";
import express from "express";
const socketio = require("socket.io");

const Data = require("./utils/data");
const { argv } = require("process");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static floor
app.use(express.static(path.join(__dirname, "Client")));

// Run when a client connect

io.on("connection", (socket:any) => {

    socket.on("new-room", (roomid:number) => {
        const room = Data.CreateRoom(roomid, socket.id)

        socket.join(room.roomID);
        socket.emit("players-update", room);
        console.log(`New card room created white id: ${room.roomID}`)
    });

    socket.on("join-room", ({username , roomID}:any) => {

        const room = Data.JoinRoom(socket.id ,username, roomID);
        if( room == null)
        {
            io.emit("players-update", room);
        } else 
        {
            socket.join(room.roomID);
            io.emit("players-update", room);
            console.log(`player ${username} (id: ${socket.id}) has enterd room ${room}`)
        }
    });
    
    socket.emit("message", "Welcome to chatCord!") 

});

//io.emit("game-update", ({}));

var PORT:number = 8080;

if(process.argv.length > 2)
    PORT = +process.argv[2];

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));