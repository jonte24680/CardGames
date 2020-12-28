const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static floor
app.use(express.static(path.join(__dirname, "Client")));

// Run when a client connect

io.on("connection", socket => {
    console.log("New WS Connect...")

    socket.emit("message", "Welcome to chatCord!")

    socket.emit()

    // brodc
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));