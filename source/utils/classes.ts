class Room {
    roomID: number;
    public: boolean;
    gameInfo: GameInfo = new GameInfo();
    allPlayers: Player[] = [];
    cardDeck: string[] = [];
    hostID: string;

    constructor(roomID: number, HostID: string){
        this.roomID = roomID;
        this.hostID = HostID;
        this.public = false;
    }
}

class GameInfo {
    type: String = "";
    currentPlayers: Player[] = []; 

    constructor(){};

}

class Player {
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

class JoiningRoom {

    username: string | null;
    roomID: number | null;

    constructor(username: string | null, roomID: number | null){
        this.username = username;
        this.roomID = roomID;
    }
}