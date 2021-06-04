"use strict";
//const GlobalClasses = require("../Client/js/classes");
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoom = exports.GetIndexRoomID = exports.JoinRoom = exports.CreateRoom = void 0;
const classes_1 = require("./classes");
var rooms = [];
function CreateRoom(roomID, hostID) {
    var RID = roomID;
    /*if (rooms == undefined) {
        rooms.push(new Room(RID, hostID));
        return rooms[rooms.length - 1]
    }*/
    while (RID == 0 || rooms.find(arr => arr.roomID == RID) != undefined) {
        RID = Math.floor(Math.random() * 1000000) + 1;
    }
    var newRoom = new classes_1.Room(RID, hostID);
    rooms.push(newRoom);
    rooms[rooms.length - 1].allPlayers = [];
    return rooms[rooms.length - 1];
}
exports.CreateRoom = CreateRoom;
function JoinRoom(roomID, username, id) {
    var i = GetIndexRoomID(roomID);
    if (i == NaN || username == null || username == "")
        return null;
    rooms[i].allPlayers.push(new classes_1.Player(username, id));
    return rooms[i];
}
exports.JoinRoom = JoinRoom;
function GetIndexRoomID(roomID) {
    if (roomID == NaN)
        return NaN;
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomID == roomID)
            return i;
    }
    return NaN;
}
exports.GetIndexRoomID = GetIndexRoomID;
function GetRoom(roomID) {
    var RID = GetIndexRoomID(roomID);
    if (RID == NaN)
        return null;
    return rooms[RID];
}
exports.GetRoom = GetRoom;
/*
module.exports = {
    CreateRoom, JoinRoom, GetIndexRoomID, GetRoom
}*/
var RoomData = {
    roomID: 20,
    public: false,
    gameInfo: {
        type: "poker",
        currentPlayers: [
            {
                name: "joe",
                id: 20,
                money: 1000,
                bet: 10,
                totalBet: 20,
                cards: [
                    "2C",
                    "6D"
                ]
            }
        ]
    },
    allPlayers: [
        {
            name: "joe",
            id: 20,
            money: 1000,
        }
    ],
    cardDeck: ["2C", "4H", "7D", "5S"],
    hostID: 10
};
//# sourceMappingURL=data.js.map