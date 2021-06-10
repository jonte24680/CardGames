import socketIO, { Socket } from "socket.io";

export class Room {
    roomID: number;
    public: boolean;
    gameInfo: GameInfo = new GameInfo();
    allPlayers: Player[] = [];
    cardDeck: string[] = [];
    hostID: string;
    io: socketIO.Server;

    constructor(roomID: number, HostID: string, io: socketIO.Server){
        this.roomID = roomID;
        this.hostID = HostID;
        this.public = false;
        this.io = io;
    }
}

export class GameInfo {
    type: String = "";
    currentPlayers: Player[] = []; 

    constructor(){};

}

export class Player {
    username: string;
    id: string;
    money: number = 10000;
    bet: number = 0;
    totalBet: number = 0;
    cards: string[] = [];

    constructor(username: string, id: string){
        this.username = username;
        this.id = id;
    }
}

export class JoiningRoom {

    username: string | null;
    roomID: number;

    constructor(username: string | null, roomID: number){
        this.username = username;
        this.roomID = roomID;
    }
}

/*if(module != undefined){
    module.exports = {Room, GameInfo, Player, JoiningRoom};
}*/