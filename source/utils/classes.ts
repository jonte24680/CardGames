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

    public StartNewGame(gameName: string): void | Error{
        if(this.gameInfo.gameName != GameName.NoGameActiv)
            return Error("Game Activ");

        this.players.forEach(player => {
            player.ResetStat();
            player.inGame == true;
        });

        if(gameName == GameName.PokerTexas){
            this.gameInfo.gameName = gameName;
            this.gameInfo.betStep = 50;
            this.gameInfo.round = 0;
            this.NewCardDeck();

            this.DealCards([{cardName: "Hand", manyCards: 2, publicSee: false, playerSee: true}]);

            this.players[0].TransferMoneyToBet(this.gameInfo.betStep);
            this.players[1].TransferMoneyToBet(this.gameInfo.betStep * 2);

            this.gameInfo.turnPlayerId = this.players[1].id;
            this.NextPlayerTurn();

        } else{
            return Error("Not a valid game name");
        }
    }

    /**
    * 
    * @param xCardDeck how many card deck what is going to be in the card deck (Default: 1)
    * @param JokersIncluded !!NOT IMPLIMENTED!! if joker is going to be inculdet in the card deck (Default: false)
    */
    public NewCardDeck(xCardDeck: number = 1, JokersIncluded: boolean = false){
        var cards: string[] = []

        for(var i = 0; i < xCardDeck; i++){
            cards = cards.concat(CardDeck());
        }

        for(var i = 0; i < 6; i++){
            var j = cards.length;
            var r : number, temp: string;
    
            while(--j > 0){
                r = Math.floor(Math.random()*j);
                temp = cards[r];
                cards[r] = cards[j];
                cards[j] = temp;
            }
        }

        this.cardDeck = cards;
    }

    public DealCards(DealCardInfos: DealCardInfo[]){
        DealCardInfos.forEach(DealCardInfo => {
            this.players.forEach(player => {
                var cards = this.cardDeck.splice(0,DealCardInfo.manyCards)
                var cardInfo = new Card(DealCardInfo.cardName, cards, DealCardInfo.playerSee, DealCardInfo.playerSee)
                player.gameStat.cards.push(cardInfo);
            });
        })
    }

    public PlayerAction(playerID : string, action: string, extra: any){
        if(playerID != this.gameInfo.turnPlayerId)
            return Error("Action From Wrong Player");
        
        if(this.gameInfo.gameName == GameName.PokerTexas){
            const PID = this.PlayerIndex(playerID);

            if (action == "Fold" && this.gameInfo.moves.fold){

                this.players[PID].inGame == false;
                const CID = this.players[PID].gameStat.GetCardIndex("Hand");
                this.players[PID].gameStat.cards[CID].cards = [];

            } else if (action == "Check" && this.gameInfo.moves.check){

                if(this.players[PID].gameStat.totalBet == this.gameInfo.maxBet){ //normal check dont rasie

                } else if(this.players[PID].money + this.players[PID].gameStat.totalBet <= this.gameInfo.maxBet){ //All In
                    this.players[PID].TransferMoneyToBet(this.players[PID].money);
                } else if(this.players[PID].gameStat.totalBet > this.gameInfo.maxBet){//going to raise to the max bet
                    this.players[PID].TransferMoneyToBet(this.gameInfo.maxBet - this.players[PID].gameStat.totalBet);
                }

            } else if (action == "Raise" && this.gameInfo.moves.rasie){
                
                if(extra.raiseValue + this.players[PID].gameStat.totalBet < this.gameInfo.maxBet)
                    extra.raiseValue = this.gameInfo.maxBet - this.players[PID].gameStat.totalBet

                this.players[PID].TransferMoneyToBet(extra.raiseValue);

            } else {
                return Error("Invalid input sent")
            }

            this.players[PID].gameStat.hasBet == true;
            this.NextPlayerTurn();
        }
    }

    private NextPlayerTurn(){
        if(this.gameInfo.gameName == GameName.PokerTexas){
           
            if (this.HasEveryoneBet()) {
                
                if(this.gameInfo.round == 0){
                    this.cardDeck.shift();

                    this.gameInfo.cards.push(new Card("table", this.cardDeck.splice(0,3)))
                } else if(this.gameInfo.round == 4){
                    
                    var allActive: WinnerCalc[] = Card.GetCardStrength(this.players, this.gameInfo.cards[0]);

                } else { // round 1 & 2 & 3
                    this.gameInfo.cards[0].cards == this.gameInfo.cards[0].cards.concat(this.cardDeck.slice(0))
                }
                this.gameInfo.round++;
            } else {
                const TurnPID = this.PlayerIndex(this.gameInfo.turnPlayerId)

                var i:number = TurnPID;
                var NextPlayerIndex = -1;

                while (NextPlayerIndex = -1){
                    i++
                    if(i >= this.players.length)
                        i = 0; //resets the posision to the last one;
                    if(i = TurnPID)
                        break; //Break Condision

                    if(this.players[i].inGame == true){
                        NextPlayerIndex = i;
                    }
                }

                if (NextPlayerIndex = -1) {
                    this.PlayerWon(this.gameInfo.turnPlayerId);
                }

                this.gameInfo.turnPlayerId = this.players[NextPlayerIndex].id;

                var move: Moves;
                if(this.players[NextPlayerIndex].gameStat.hasBet){
                    move = new Moves(["fold", "check"]);
                } else{
                    move = new Moves(["fold", "check", "raise"]);
                }
            }
        }
    }

    private HasEveryoneBet(): boolean{
        this.players.forEach(player =>{
            if(player.inGame == true){
                if(player.gameStat.hasBet == true)
                    return false;
                else if(player.gameStat.totalBet < this.gameInfo.maxBet){
                    if(player.money != 0){
                        return false;
                    }
                }
            }

        });
        return true;
    }

    private PlayerWon(playerID: string){
        if(this.gameInfo.gameName == GameName.PokerTexas){
            const PID = this.PlayerIndex(playerID)
            var winningBet = this.players[PID].gameStat.totalBet;
            var moneyWon = 0;

            this.players.forEach(player => {

                moneyWon += winningBet;
                player.gameStat.totalBet -= winningBet

                if(player.gameStat.bet < 0){
                    moneyWon += player.gameStat.totalBet;
                    player.gameStat.totalBet = 0;
                }

                if(player.gameStat.totalBet > 0){
                    player.money -= player.gameStat.totalBet;
                    player.gameStat.totalBet = 0;
                }

            });

            this.players[PID].money += moneyWon;

            this.gameInfo.gameName = GameName.NoGameActiv;
        }
    }

    public PlayerData(playerID:string): Room {
        var roomData = this;
        
        roomData.cardDeck.fill("??")

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

    PlayerIndex(playerID: string): number{
        return this.players.findIndex((player) => player.id == playerID );
    }
}

export class GameInfo {
    gameName: GameName = GameName.NoGameActiv;
    turnPlayerId: string = "";
    moves: Moves = new Moves();
    maxBet: number = 0;
    betStep: number = 0;
    cards: Card[] = [];
    round: number = 0;

    constructor(){};

    public ChangeMaxBetWhenHigher(playerNewMaxBet: number): void{
        if(playerNewMaxBet > this.maxBet)
            this.maxBet = playerNewMaxBet;
    }
}

export enum GameName{
    NoGameActiv = "NoGameActive",
    PokerTexas = "PokerTexas",
}
export class Moves {
    fold: boolean = false;
    check: boolean = false;
    rasie: boolean = false;

    constructor(moves: string[] = []){
        moves.forEach(move => {
            move = move.toLowerCase();
            if(move == "fold")
                this.fold = true;
            else if (move == "check")
                this.check = true;
            else if (move == "raise")
                this.rasie = true;
            else
                console.warn(`the move "${move}" has not been registerd. Typo? Not implemented?`);
                
        });
    };
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

    TransferMoneyToBet(money: number){ 
        if(money > this.money)
            money = this.money;
        
        this.gameStat.bet =+ money;
        this.gameStat.totalBet =+ money;
        this.money =- money;
    }

    ResetStat(){
        this.gameStat = new GameStat()
    }
}

export class GameStat {
    hasBet: boolean = false;
    bet: number = 0;
    totalBet: number = 0;
    cards: Card[] = [];

    public GetCardIndex(name: string): number{
        return this.cards.findIndex((card) => card.name == name)
    }

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

    static GetCardStrength(players: Player[], tableCard: Card): WinnerCalc[]{
        let ret: WinnerCalc[] = []
        players.forEach(player => {
            if(player.inGame == true){
                function ToNumber(string: string){
                    if(string == "A")
                        return 1;
                    else if (string == "J")
                        return 11;
                    else if (string == "Q")
                        return 12;
                    else if (string == "K")
                        return 13;
                    else
                        return Number(string)
                }

                function HighestWinnerCalc(winnerCalc1: WinnerCalc, winnerCalc2: WinnerCalc): WinnerCalc | null{
                    if(winnerCalc1 == null)
                        return winnerCalc2;
                    if(winnerCalc2 == null)
                        return winnerCalc1;

                    if(winnerCalc1.bigPoint > winnerCalc2.bigPoint)
                        return winnerCalc1;
                    else if(winnerCalc1.bigPoint < winnerCalc2.bigPoint)
                        return winnerCalc2;
                    else {
                        var point1: number[] = winnerCalc1.smallPoints.map(x => ToNumber(x));
                        var point2: number[] = winnerCalc2.smallPoints.map(x => ToNumber(x));

                        if(winnerCalc1.bigPoint == 5){
                            if(point1[0] == 1)
                                point1[0] = 14;
                            if(point2[0] == 1)
                                point2[0] = 14;
                        }

                        for(let i = 0; i < point1.length; i++){
                            if( point1[i] > point2[i])
                                return winnerCalc1
                            else if( point1[i] < point2[i])
                                return winnerCalc2
                        }
                    }
                    return null
                }

                let cards_string: string[] = player.gameStat.cards[player.gameStat.GetCardIndex("Hand")].cards.concat(tableCard.cards);

                let cards_sorted = cards_string.sort((a,b) => {
                
                    var A = ToNumber(a.split("")[0])
                    var B = ToNumber(b.split("")[0])
                    
                    return A-B;
                });

                var bestHand: WinnerCalc = null;

                if(() => {// If Straight 5
                    let cards_sorted_noDupe: string[] = [];

                    cards_sorted.forEach(card=>{
                        if(!cards_sorted_noDupe.map(value => value.split("")[0]).includes(card.split("")[0]))
                            cards_sorted_noDupe.push(card);
                    });
                    
                    if (cards_sorted_noDupe.length < 5)
                        return false; 
                    
                    function GetNumber(index: number):number{
                        if(index < cards_sorted_noDupe.length)
                            return ToNumber(cards_sorted_noDupe[index].split("")[0]);
                        else if (index == cards_sorted_noDupe.length){
                            let res = ToNumber(cards_sorted_noDupe[0].split("")[0])
                            if (res == 1)
                                res = 14
                            return res;
                        }
                        throw new Error("Index is to high over length ( index > length)");
                        
                    }

                    var score: WinnerCalc = null;
                    for (let i = 0; i < cards_sorted_noDupe.length; i++) {
                        var isStraight = true;
                        for(var j = 1; j < 5; j++){
                            if(GetNumber(i) + j != GetNumber(i + j)){
                                isStraight = false
                            }
                            score = HighestWinnerCalc(score, {player: player, bigPoint: 5, smallPoints: cards_sorted_noDupe.splice( 0, 5)})
                        }
                    }

                    if(score = null)
                        return false
                        
                    bestHand = HighestWinnerCalc(bestHand, score);
                    return true;

                }){
                    if(/* Straight flush */ false){
                        if(/* Royal flush */ false){

                        }
                    }
                }
            }
        });

        return ret;
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

interface DealCardInfo{
    cardName: string;
    manyCards: number;
    publicSee: boolean;
    playerSee: boolean;
}

interface WinnerCalc{
    player: Player;
    bigPoint: number;
    smallPoints: string[];
}

/*if(module != undefined){
    module.exports = {Room, GameInfo, Player, JoiningRoom};
}*/