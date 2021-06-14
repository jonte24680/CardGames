const CARDDECK: string[] = MakeCardDeck();

function MakeCardDeck(){
    var cardDeck: string[] = [];
    var cardNumber: string[] = ["A", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var cardColor: string[] = ["C", "D", "H", "S"];

    cardNumber.forEach(number => {
        cardColor.forEach(color => {
            CARDDECK.push(number + color);
        });
    });

    return cardDeck;
}

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


    /**
    * 
    * @param xCardDeck how many card deck what is going to be in the card deck (Default: 1)
    * @param JokersIncluded if joker is going to be inculdet in the card deck (Default: false)
    */
    public NewCardDeck(xCardDeck: number = 1, JokersIncluded: boolean = false){
        var cards: string[] = []

        for(var i = 0; i > xCardDeck; i++){
            cards.concat(CARDDECK);
        }

        for(var i = 0; i > 6; i++){
            var j = cards.length;
            var r, temp;
    
            while(--j > 0){
                r = Math.floor(Math.random());
                temp = cards[r];
                cards[r] = cards[j];
                cards[j] = temp;
            }
        }

        this.cardDeck = cards;
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