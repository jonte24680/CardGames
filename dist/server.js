"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// Dependensy
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const Data = require("./utils/data");
//
// Create Server
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "Client")));
const server = http_1.default.createServer(app);
const io = require("socket.io")(server);
//
// Run when a client connect
io.on("connection", (socket) => {
    //Host
    socket.on("new-room", (roomid) => {
        const room = Data.CreateRoom(roomid, socket.id);
        socket.join(room.roomID);
        socket.emit("players-update", room);
        console.log(`New card room created white id: ${room.roomID}`);
    });
    //Player
    socket.on("join-room", (joinData) => {
        const room = Data.JoinRoom(joinData.roomID, joinData.username, socket.id);
        if (room == null) {
            io.emit("players-update", room);
        }
        else {
            socket.join(room.roomID);
            io.to(room.roomID).emit("players-update", room);
            console.log(`player ${joinData.username} (id: ${socket.id}) has enterd room ${room}`);
        }
    });
});
//io.emit("game-update", ({}));
//
// Port 
const { argv } = require("process");
var PORT = 8080;
if (process.argv.length > 2)
    PORT = +process.argv[2];
server.listen(PORT, () => console.log(`Server running on port ${PORT}. localhost:${PORT}`));
//# sourceMappingURL=server.js.map