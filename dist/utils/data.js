"use strict";
var rooms = [];
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
function CreateRoom(roomID, hostID) {
    var RID = roomID;
    /*if (rooms == undefined) {
        rooms.push(new Room(RID, hostID));
        return rooms[rooms.length - 1]
    }*/
    while (RID == 0 || rooms.find(arr => arr.roomID == RID) != undefined) {
        RID = Math.floor(Math.random() * 1000000) + 1;
    }
    rooms.push(new Room(RID, hostID));
    return rooms[rooms.length - 1];
}
function JoinRoom(roomID, username, id) {
    var i = GetIndexRoomID(roomID);
    if (i == NaN)
        return null;
    rooms[i].allPlayers.push(new Player(username, id));
    return rooms[i];
}
function GetIndexRoomID(roomID) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomID == roomID)
            return i;
    }
    return NaN;
}
function GetRoom(roomID) {
    var RID = GetIndexRoomID(roomID);
    if (RID == NaN)
        return null;
    return rooms[RID];
}
module.exports = {
    CreateRoom,
    JoinRoom,
    GetIndexRoomID,
    GetRoom
};
class Room {
    constructor(roomID, HostID) {
        this.gameInfo = new GameInfo();
        this.allPlayers = [];
        this.cardDeck = [];
        this.roomID = roomID;
        this.hostID = HostID;
        this.public = false;
    }
}
class GameInfo {
    constructor() {
        this.type = "";
        this.currentPlayers = [];
    }
    ;
}
class Player {
    constructor(username, id) {
        this.money = 10000;
        this.bet = 0;
        this.totalBet = 0;
        this.cards = [];
        this.username = username;
        this.id = id;
    }
}
