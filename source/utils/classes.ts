export class Room {
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

    public PlayerData(playerID:string): Room {
        var roomData = this;
        //roomData.allPlayers.forEach(element => {
        //    if(playerID != element.id){
        //        element.cards = ["??", "??"]
        //    }
        //});
        roomData.gameInfo.currentPlayers.forEach(element => {
            if(playerID != element.id){
                element.cards = ["??", "??"];
            }
        });

        return roomData;
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