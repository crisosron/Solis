/**
 * Represents a socket room, where the member sockets are the sockets of Player instances in the same game. 
 * 
*/
class GameRoom{

    /** 
    * @constructor
    * @param {string} gameID - A string of randomly generated numbers that identifies this GameRoom
    * @param {Player} gameCreator - Player instance that created a game to generate this GameRoom instance
    */
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
        console.log("Inside addPlayer method in gameRoom. ", player);
        this._players.push(player);
    }

    // TODO: Executing this function leads to undefined for some reason. Fix it.
    printDetails(){
        console.log("Inside printDetails!");
    }
}

module.exports = GameRoom;