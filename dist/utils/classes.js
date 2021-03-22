"use strict";
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
class JoiningRoom {
    constructor(username, roomID) {
        this.username = username;
        this.roomID = roomID;
    }
}
//# sourceMappingURL=classes.js.map