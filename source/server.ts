//
// Dependensy
import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";

//const Data = require("./utils/data");
import {CreateRoom, JoinRoom, GetIndexRoomID, GetRoom} from "./utils/data";
//import Data from "./utils/data"
//const nåt = require(./Client/js/classes);
import {Room, Player, GameInfo, JoiningRoom} from "./utils/classes";

//
// Create Server

const app = express();
app.use(express.static(path.join(__dirname, "Client")));
const server = http.createServer(app);
const io: socketIO.Server = require("socket.io")(server);

//
// Run when a client connect

io.on("connection", (socket: socketIO.Socket) => {
    var ROOMID: number;
    
    //Host
    socket.on("new-room", (roomid:number) => {
        const room = CreateRoom(roomid, socket.id)

        socket.join(room.roomID.toString());
        ROOMID = room.roomID;
        
        UpdateClients(room);
        console.log(`New card room created white id: ${room.roomID}`)
    });

    //Player
    socket.on("join-room", (joinData: any) => {

        const room = JoinRoom(joinData.roomID ,joinData.username, socket.id);
        if( room == null)
        {
            io.emit("players-update", {error: 404});
        } else {
            socket.join(room.roomID.toString());
            ROOMID = room.roomID;
            
            UpdateClients(room);
            console.log(`player ${joinData.username} (id: ${socket.id}) has enterd room ${room.roomID}`)
        }
    });

});

function UpdateClients(room: Room){
    io.to(room.hostID).emit("players-update", room)
    room.allPlayers.forEach(player => {
        io.to(player.id).emit("players-update", room.PlayerData(player.id))
    });
}

//io.emit("game-update", ({}));

//
// Port 

const { argv } = require("process");

var PORT:number = 8080;

if(process.argv.length > 2)
    PORT = +process.argv[2];

server.listen(PORT, () => console.log(`Server running on port ${PORT}. http://localhost:${PORT}`));

