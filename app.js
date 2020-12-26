const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const hostname = "192.168.1.114";
const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(8080, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});