class GameRoom{
    constructor(gameID, gameCreator){
        this._gameID = gameID;
        this._players = [gameCreator];
        this._gameAttributes = null;
    }

    get gameID(){
        return this._gameID;
    }

    get players(){
        return this._players;
    }

    get gameAttributes(){
        return this._gameAttributes;
    }

    set gameAttributes(gameAttributes){
        this._gameAttributes = gameAttributes;
    }

    addPlayer(player){
        this._players.push(player);
    }

    // TODO: Executing this function leads to undefined for some reason. Fix it.
    printDetails(){
        console.log(`gameID: ${this._gameID}, # of players in room: ${this._players.length}`);
    }
}