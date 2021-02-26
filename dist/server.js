"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socketio = require("socket.io");
const Data = require("./utils/data");
const { argv } = require("process");
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socketio(server);
// Set static floor
app.use(express_1.default.static(path_1.default.join(__dirname, "Client")));
// Run when a client connect
io.on("connection", (socket) => {
    socket.on("new-room", (roomid) => {
        const room = Data.CreateRoom(roomid, socket.id);
        socket.join(room.roomID);
        socket.emit("players-update", room);
        console.log(`New card room created white id: ${room.roomID}`);
    });
    socket.on("join-room", ({ username, roomID }) => {
        const room = Data.JoinRoom(socket.id, username, roomID);
        if (room == null) {
            io.emit("players-update", room);
        }
        else {
            socket.join(room.roomID);
            io.emit("players-update", room);
            console.log(`player ${username} (id: ${socket.id}) has enterd room ${room}`);
        }
    });
    socket.emit("message", "Welcome to chatCord!");
});
//io.emit("game-update", ({}));
var PORT = 8080;
if (process.argv.length > 2)
    PORT = +process.argv[2];
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
