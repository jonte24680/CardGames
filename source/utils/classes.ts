import clone from "just-clone";

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

            this.players.forEach(player=> {
                player.inGame = true;
            })
            this.players[0].TransferMoneyToBet(this.gameInfo.betStep);
            this.players[1].TransferMoneyToBet(this.gameInfo.betStep * 2);
            this.gameInfo.maxBet = this.gameInfo.betStep *2;

            this.gameInfo.turnPlayerId = this.players[1].id;
            this.NextPlayerTurn(true);

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
            cards = cards.concat(Card.CardDeck());
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
                var cardInfo = new Card(DealCardInfo.cardName, cards, DealCardInfo.publicSee, DealCardInfo.playerSee)
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
                } else if(this.players[PID].gameStat.totalBet < this.gameInfo.maxBet){//going to raise to the max bet
                    this.players[PID].TransferMoneyToBet(this.gameInfo.maxBet - this.players[PID].gameStat.totalBet);
                }
                this.UpdateMaxBet();
            } else if (action == "Raise" && this.gameInfo.moves.rasie){
                
                if(extra.raiseValue + this.players[PID].gameStat.totalBet < this.gameInfo.maxBet)
                    extra.raiseValue = this.gameInfo.maxBet - this.players[PID].gameStat.totalBet

                this.players[PID].TransferMoneyToBet(extra.raiseValue);
                this.gameInfo.maxBet += extra.raiseValue;
                this.UpdateMaxBet();
            } else {
                return Error("Invalid input sent")
            }

            this.players[PID].gameStat.hasBet = true;
            this.NextPlayerTurn();
        }
    }

    private NextPlayerTurn(HasBegun: boolean = false){
        if(this.gameInfo.gameName == GameName.PokerTexas){
           
            if (this.HasEveryoneBet() && !HasBegun) {
                
                if(this.gameInfo.round == 0){
                    this.cardDeck.shift();

                    this.gameInfo.cards.push(new Card("table", this.cardDeck.splice(0,3)))
                } else if(this.gameInfo.round == 3){
                    var allActive: WinnerCalc[] = Card.GetCardStrengths(this.players, this.gameInfo.cards[0]);
                    var allWinners = WinnerCalc.GetBestWinnerCalc(allActive);
                    if(allWinners == null)
                        return;
                    this.PlayerWon(allWinners);
                    return;
                } else { // round 1 & 2
                    //this.gameInfo.cards[0].cards == this.gameInfo.cards[0].cards.concat(this.cardDeck.slice(0))
                    var card = this.cardDeck.shift()
                    if (card == undefined) 
                        return;
                    this.gameInfo.cards[0].cards.push(card);
                }

                this.players.forEach(player => {
                    player.NewRound();
                });

                this.gameInfo.round++;
            }

            const TurnPID = this.PlayerIndex(this.gameInfo.turnPlayerId)

            var i:number = TurnPID;
            var NextPlayerIndex = -1;

            while (NextPlayerIndex == -1){
                i++
                if(i >= this.players.length)
                    i = 0; //resets the posision to the last one;
                if(i == TurnPID)
                    break; //Break Condision

                if(this.players[i].inGame == true){
                    NextPlayerIndex = i;
                }
            }

            if (NextPlayerIndex == -1) {
                this.PlayerWon([new WinnerCalc(0, ["0"], this.players[this.PlayerIndex(this.gameInfo.turnPlayerId)])])
                //this.PlayerWon(this.gameInfo.turnPlayerId);
            }

            this.gameInfo.turnPlayerId = this.players[NextPlayerIndex].id;

            if(this.players[NextPlayerIndex].gameStat.hasBet){
                this.gameInfo.moves = new Moves(["fold", "check"]);
            } else{
                this.gameInfo.moves = new Moves(["fold", "check", "raise"]);
            }
        }
    }

    private UpdateMaxBet(){
        var higest: number = 0;
        this.players.forEach(player => {
            higest = Math.max(higest, player.gameStat.totalBet) ;
        });
        if(higest == undefined)
            return;
        this.gameInfo.maxBet = higest;
    }

    private HasEveryoneBet(): boolean{
        var ret = true;
        this.players.forEach((player) => {
            if(player.inGame == true){
                if(player.gameStat.hasBet == false)
                    ret = false;
                else if(player.gameStat.totalBet < this.gameInfo.maxBet){
                    if(player.money != 0){
                        ret = false;
                    }
                }
            }
        });
        return ret;
    }

    /**
     *  calculate and gives players the money the have won
     * @param playerWon all the players what has won
     * @todo add abileti for side pots for player what make all in and other 
     * player rayse ower him so he get the rigth amout of money
     */
    private PlayerWon(playerWon: WinnerCalc[]){
        if(this.gameInfo.gameName == GameName.PokerTexas){
            // gets all the money
            var moneyPot = 0;
            this.players.forEach(player => {
                moneyPot += player.gameStat.totalBet
                player.gameStat.totalBet = 0
                /*// may be usfull when side pots gets added
                moneyPot += winningBet;
                player.gameStat.totalBet -= winningBet
                
                if(player.gameStat.bet < 0){
                    moneyPot += player.gameStat.totalBet;
                    player.gameStat.totalBet = 0;
                }
                
                if(player.gameStat.totalBet > 0){
                    player.money -= player.gameStat.totalBet;
                    player.gameStat.totalBet = 0;
                }*/
            });

            var moneyWon = moneyPot/playerWon.length

            playerWon.forEach(winnerCalc => {
                if(winnerCalc.player == null)
                    return;
                const PID = this.PlayerIndex(winnerCalc.player.id)
                this.players[PID].money += moneyWon;
            });

            //this.gameInfo.gameName = GameName.NoGameActiv;
            this.gameInfo.turnPlayerId = "";
        }
    }

    public Reset(){
        this.gameInfo.maxBet = 0;
        this.gameInfo.cards = [];
        this.gameInfo.gameName = GameName.NoGameActiv;
        this.gameInfo.moves = new Moves();
        this.gameInfo.round = 0;
        this.gameInfo.turnPlayerId = "";

        this.cardDeck = [];

        this.players.forEach(player => {
            player.ResetStat();
            player.inGame = false;
        });
    }

    public PlayerData(playerID:string): Room {
        var roomData: Room = clone(this);
        
        if (this.gameInfo.turnPlayerId != ""){
            roomData.cardDeck.fill("??");
    
            roomData.players.forEach(player => {
                if(playerID == player.id){
                    player.gameStat.cards.forEach(cards => {
                        if (cards.playerSee == false)
                            cards.cards.fill("??");
                    }); // cards.MakeHidden(); it is not a room class in js
                } else {
                    player.gameStat.cards.forEach(cards => {
                        if (cards.publicSee == false)
                            cards.cards.fill("??");
                    });
                }
            });
        }

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
        
        this.gameStat.bet += money;
        this.gameStat.totalBet += money;
        this.money -= money;
    }

    ResetStat(){
        this.gameStat = new GameStat()
    }

    NewRound(){
        this.gameStat.hasBet = false;
        this.gameStat.bet = 0;
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
    
    public static readonly cardColors: string[] = ["C", "D", "H", "S"];
    public static readonly cardNumbers: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; 
    
    static CardDeck(){
        var deck: string[] = []
        Card.cardNumbers.forEach(number => {
            Card.cardColors.forEach(color => {
                deck.push(number + color);
            });
        });
        return deck;
    }

    public MakeHidden() {
        this.cards.fill("??");
    }

    public static ToNumber(string: string, IsColor: boolean = true , aceLow: boolean = true): number{
        if (IsColor) {
            var split = string.split("")
            split.pop();
            string = ""
            split.forEach(str => {
                string += str;
            });
        }

        if(string == "A")
            return aceLow ? 1 : 14;
        if (string == "J")
            return 11;
        if (string == "Q")
            return 12;
        if (string == "K")
            return 13;
        return Number(string)
    }

    public static SortCardsAceLow(a:string, b:string): number{
        var A = Card.ToNumber(a.split("")[0], true)
        var B = Card.ToNumber(b.split("")[0], true)
        
        return A-B;
    }
    public static SortCardsAceHigh(a:string, b:string): number{
        var A = Card.ToNumber(a.split("")[0], false)
        var B = Card.ToNumber(b.split("")[0], false)
        
        return A-B;
    }

    public static FilterColor(cards: string[], color: string): string[]{
        return cards.filter(card => card.split("")[1] == color)
    }

    public static GetHighestCards(cards: string[], amount: number): string[]{
        var sortedCards = cards.sort(this.SortCardsAceHigh).reverse();
        return sortedCards.splice(0,amount);
        
    }

    public static PutAceLast(cards: string[]): string[]{
        // Old Implimitation
        /*var sortedCards = cards.sort(this.SortCards);
        var last = cards.map(card => this.ToNumber(card)).lastIndexOf(1);
        var removed = sortedCards.splice(0, last);
        sortedCards.concat(removed);*/
        return cards.sort(Card.SortCardsAceHigh);
    }

    public static GetCardStrengths(players: Player[], tableCard: Card): WinnerCalc[]{
        let ret: WinnerCalc[] = []
        players.forEach(player => {
            if(player.inGame == true){

                let cards_string: string[] = player.gameStat.cards[player.gameStat.GetCardIndex("Hand")].cards.concat(tableCard.cards);
                ret.push(this.GetCardStrenght(player, cards_string))
            }
        });
        return ret;
    }

    static GetCardStrenght(player: Player, cards: string[]): WinnerCalc{
        //let cards_sorted = cards.sort(this.SortCards);

        var bestHand: WinnerCalc | null = null;

        /* ToDo: 
            Make sure what ace (1) is the first in the small point
        */
        bestHand = WinnerCalc.BetterWinnerCalc(bestHand, this.LookForPair(cards));   
        bestHand = WinnerCalc.BetterWinnerCalc(bestHand, this.LookForFlush(cards));    
        bestHand = WinnerCalc.BetterWinnerCalc(bestHand, this.LookForStraight(cards));
        bestHand = WinnerCalc.BetterWinnerCalc(bestHand, this.LookForStraightFlush(cards)); 
        bestHand = WinnerCalc.BetterWinnerCalc(bestHand, this.LookForRoyalFlush(cards)); 

        if(bestHand == null)
            throw new Error(`player: ${player.username} has no besthand???`)

        bestHand.player = player

        return bestHand;          
    }

    public static LookForPair(cards : string[]): WinnerCalc | null{
        cards = cards.sort(Card.SortCardsAceHigh);
        var pair: string[][] = []; // 
        var three: string[][] = [];
        var four: string[][] = [];
        var rest: string[] = [];
        for (let i = 0; i < cards.length; i++) {
            if(i < cards.length - 1  && this.ToNumber(cards[i]) == this.ToNumber(cards[i+1])){
                if(i < cards.length - 2  && this.ToNumber(cards[i]) == this.ToNumber(cards[i+2])){
                    if(i < cards.length - 3  && this.ToNumber(cards[i]) == this.ToNumber(cards[i+3])){
                        // Four of a kind
                        four.push([cards[i], cards[i+1], cards[i+2], cards[i+3]])
                        i += 3;
                    } else {
                        // Three of a kind
                        three.push([cards[i], cards[i+1], cards[i+2]]);
                        i += 2;
                    }
                } else {
                    // pair
                    pair.push([cards[i], cards[i+1]]);
                    i++;
                }
            } else {
                // non of above
                rest.push(cards[i]);
            }
        }

        if (four.length > 0){
            // four of a kind
            var theOne = four.pop();
            rest = Card.PutAceLast(rest.concat(pair.flat(), three.flat(), four.flat()).flat().sort(Card.SortCardsAceHigh));
            if(theOne == undefined || rest == undefined)
                return null; // andgry compiler
            var pop = rest.pop()
            if(pop == undefined)
                return null;
            theOne.push();
            return new WinnerCalc(7, theOne);
        }
        if (three.length > 0){
            var theOne = three.pop();
            if(three.length > 0 || pair.length > 0){
                // full house
                var thePair = pair.concat(three).sort((a,b) => Card.ToNumber(a[0], false) - Card.ToNumber(b[0], false)).pop();
                
                if(theOne == undefined || thePair == undefined)
                    return null; // angry compiler
                theOne.concat(thePair.splice(0,2));
                return new WinnerCalc(6, theOne);
            }
            // three of a kind
            //rest = rest.concat(pair.flat(), three.flat()).sort(Card.SortCards); // dont think i need this

            if(theOne == undefined)
                return null;
            return new WinnerCalc(3, theOne.concat(rest.splice(rest.length - 2,2)))
        }
        if(pair.length > 0){
            var first = pair.pop();
            if(pair.length > 0){
                // two pairs
                var secund = pair.pop();
                var last = Card.PutAceLast(rest.concat(pair.flat()).sort(Card.SortCardsAceHigh)).pop()
                if(first == undefined || secund == undefined || last == undefined)
                    return  null;
                return new WinnerCalc(2, first.concat(secund, last));
            }
            // pair
            if(first == undefined)
                return null;
            return new WinnerCalc(1, first.concat(rest.splice(rest.length - 3, 3)));
        }
        return new WinnerCalc(0, rest.splice(rest.length - 5, 5));
    }

    public static LookForFlush(cards : string[]): WinnerCalc | null{
        cards = cards.sort(Card.SortCardsAceHigh);
        var score: WinnerCalc | null = null;

        for (let i = 0; i < this.cardColors.length; i++) {
            var card_filterd = this.FilterColor(cards, this.cardColors[i])
            if (card_filterd.length >= 5) {
                var tScore = WinnerCalc.BetterWinnerCalc(score, new WinnerCalc(5, card_filterd.splice(card_filterd.length - 5, 5).reverse()));
                if(tScore != null){
                    score = tScore
                }
            }
        }
        return score
    }

    public static LookForStraight(cards : string[], bigPoint: number = 4) : WinnerCalc | null{
        cards = cards.sort(Card.SortCardsAceLow);
        let cards_noDupe: string[] = [];

        cards.forEach(card=>{
            if(!cards_noDupe.map(value => value.split("")[0]).includes(card.split("")[0]))
            cards_noDupe.push(card);
        });
        
        if (cards_noDupe.length < 5)
            return null; 
        
        function GetNumber(index: number):number{
            if(index < cards_noDupe.length)
            return Card.ToNumber(cards_noDupe[index].split("")[0]);
            else if (index == cards_noDupe.length){
                let res = Card.ToNumber(cards_noDupe[0].split("")[0])
                if (res == 1)
                res = 14
                return res;
            }
            throw new Error("Index is to high over length ( index > length)");
        }

        function GetSplicedStraight(i:number): string[] {
            var temp = cards_noDupe
            if(i + 4 == cards_noDupe.length)
                return temp.splice(i,4).concat(temp[0])
            return temp.slice(i, 5);
        }
        
        var score: WinnerCalc | null = null;
        for (let i = 0; i < cards_noDupe.length - 4; i++) {
            var isStraight = true;
            for(var j = 1; j < 5; j++){
                if(GetNumber(i) + j != GetNumber(i + j)){
                    isStraight = false
                }
            }
            if(isStraight)
                score = WinnerCalc.BetterWinnerCalc(score, new WinnerCalc(bigPoint, GetSplicedStraight(i)))
        }
        return score
    }

    public static LookForStraightFlush(cards : string[], bigPoint: number = 8): WinnerCalc | null{
        cards = cards.sort(Card.SortCardsAceLow);
        var score: WinnerCalc | null = null;
        score = WinnerCalc.BetterWinnerCalc(score, this.LookForStraight(this.FilterColor(cards, "C"), bigPoint))
        score = WinnerCalc.BetterWinnerCalc(score, this.LookForStraight(this.FilterColor(cards, "D"), bigPoint))
        score = WinnerCalc.BetterWinnerCalc(score, this.LookForStraight(this.FilterColor(cards, "H"), bigPoint))
        score = WinnerCalc.BetterWinnerCalc(score, this.LookForStraight(this.FilterColor(cards, "S"), bigPoint))
        return score;
    }

    public static LookForRoyalFlush(cards: string[]): WinnerCalc | null{   
        cards = cards.sort(Card.SortCardsAceLow); 
        var royal = cards.filter(card => {
            card = card.split("")[0];
            return card == "A" || card == "10" || card == "J" || card == "Q" || card == "K";
        })
        return this.LookForStraightFlush(royal, 9);
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

class WinnerCalc{
    player: Player | null;
    bigPoint: number;
    smallPoints: string[];

    constructor(bigPoint: number, smallPoints: string[], player: Player | null = null){
        this.bigPoint = bigPoint;
        this.smallPoints = smallPoints;
        this.player = player
    }

    public BetterWinnerCalc(winnerCalc2: WinnerCalc | null): WinnerCalc | null{ 
        return WinnerCalc.BetterWinnerCalc(this, winnerCalc2)
    }

    static BetterWinnerCalc(winnerCalc1: WinnerCalc | null, winnerCalc2: WinnerCalc | null): WinnerCalc | null{
        if(winnerCalc1 == null)
            return winnerCalc2;
        if(winnerCalc2 == null)
            return winnerCalc1;
        if(WinnerCalc.Equal(winnerCalc1, winnerCalc2))
            return null;

        return WinnerCalc.isBigger(winnerCalc1, winnerCalc2) ? winnerCalc1 : winnerCalc2;
    } 

    public Equal(winnerCalc2: WinnerCalc): boolean{ 
        return WinnerCalc.Equal(this, winnerCalc2);
    }

    static Equal(winnerCalc1: WinnerCalc, winnerCalc2: WinnerCalc): boolean{
        if(winnerCalc1 != winnerCalc2)
            return false

        var point1: number[] = winnerCalc1.smallPoints.map(x => Card.ToNumber(x));
        var point2: number[] = winnerCalc2.smallPoints.map(x => Card.ToNumber(x));

        if(winnerCalc1.bigPoint == 5){
            if(point1[0] == 1)
                point1[0] = 14;
            if(point2[0] == 1)
                point2[0] = 14;
        }

        for(let i = 0; i < point1.length; i++){
            if( point1[i] != point2[i])
                return false
        }

        return true;
    }

    public isBigger(winnerCalc2: WinnerCalc): boolean{
        return WinnerCalc.isBigger(this, winnerCalc2);
    }

    private static isBigger(winnerCalc1: WinnerCalc, winnerCalc2: WinnerCalc): boolean{
        if(winnerCalc1.bigPoint > winnerCalc2.bigPoint)
            return true;
        else if(winnerCalc1.bigPoint < winnerCalc2.bigPoint)
            return false;
        else {
            var point1: number[] = winnerCalc1.smallPoints.map(x => Card.ToNumber(x));
            var point2: number[] = winnerCalc2.smallPoints.map(x => Card.ToNumber(x));
    
            if(winnerCalc1.bigPoint == 5){
                if(point1[0] == 1)
                    point1[0] = 14;
                if(point2[0] == 1)
                    point2[0] = 14;
            }
    
            for(let i = 0; i < point1.length; i++){
                if( point1[i] > point2[i])
                    return true
                else if( point1[i] < point2[i])
                    return false
            }
        }
        return false;
    }
    

    static GetBestWinnerCalc(winnerCalcs : WinnerCalc[]): WinnerCalc[] | null{
        if(winnerCalcs.length == 0)
            return null
        var best: WinnerCalc[] = [winnerCalcs[0]];
        for (let i = 1; i < winnerCalcs.length; i++) {
            if(best[0].Equal(winnerCalcs[i])){
                best.push()
            }
            else if (!WinnerCalc.isBigger(best[0], winnerCalcs[i])){
                best = [winnerCalcs[i]]
            }
        }
        return best;
    }
}

/*if(module != undefined){
    module.exports = {Room, GameInfo, Player, JoiningRoom};
}*/