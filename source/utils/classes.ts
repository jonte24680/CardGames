const CARDDECK: string[] = CardDeck();

function CardDeck(){
    var cardDeck: string[] = [];
    var cardNumber: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var cardColor: string[] = ["C", "D", "H", "S"];

    cardNumber.forEach(number => {
        cardColor.forEach(color => {
            cardDeck.push(number + color);
        });
    });

    return cardDeck;
}

export class Room {
    roomID: number;
    public: boolean;
    gameInfo: GameInfo = new GameInfo();
    players: Player[] = [];
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
            cards.concat(CardDeck());
        }

        for(var i = 0; i > 6; i++){
            var j = cards.length;
            var r : number, temp;
    
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
        roomData.players.forEach(player => {
            if(playerID != player.id){
                player.gameStat.cards.forEach(cards => {
                    if (cards.publicSee == false)
                        cards.MakeHidden();
                });
            } else {
                player.gameStat.cards.forEach(cards => {
                    if (cards.playerSee == false)
                        cards.MakeHidden();
                });
            }
        });

        return roomData;
    }
}

export class GameInfo {
    gameName: GameName = GameName.NoGameActiv;
    turnPlayerId: string = "";
    moves: Moves = new Moves();
    cards: Card[] = [];

    constructor(){};

}

export enum GameName{
    NoGameActiv = "NoGameActive",
    PokerTexas = "PokerTexas",
}
export class Moves {
    fold: boolean = false;
    check: boolean = false;
    rasie: boolean = false;

    constructor(){};
}

export class Player {
    username: string;
    id: string;
    inGame: boolean = false;
    money: number = 10000;
    gameStat: GameStat = new GameStat();

    constructor(username: string, id: string){
        this.username = username;
        this.id = id;
    }
}

export class GameStat {
    bet: number = 0;
    totalBet: number = 0;
    cards: Card[] = [];

    constructor(){};
}

export class Card{
    cards: string[] = [];
    publicSee: boolean = false;
    playerSee: boolean = true;
    name: string = "";

    constructor(name: string, cards: string[] = [], publicSee: boolean = false, playerSee: boolean = true){
        this.name = name;
        this.cards = cards;
        this.publicSee = publicSee;
        this.playerSee = playerSee;
    };

    public MakeHidden(){
        this.cards.fill("??");
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