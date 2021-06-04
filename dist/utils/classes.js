"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiningRoom = exports.Player = exports.GameInfo = exports.Room = void 0;
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
exports.Room = Room;
class GameInfo {
    constructor() {
        this.type = "";
        this.currentPlayers = [];
    }
    ;
}
exports.GameInfo = GameInfo;
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
exports.Player = Player;
class JoiningRoom {
    constructor(username, roomID) {
        this.username = username;
        this.roomID = roomID;
    }
}
exports.JoiningRoom = JoiningRoom;
/*if(module != undefined){
    module.exports = {Room, GameInfo, Player, JoiningRoom};
}*/ 
//# sourceMappingURL=classes.js.map