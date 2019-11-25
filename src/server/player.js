// Represents a player within the game
class Player {

    // TODO: Appearing as SyntaxError
    // static DEFAULT_COLOR = "#ffffff"
    // static DEFAULT_USER_NAME = "Anon"

    // Construct a Player, setting all fields to null / Empty arrays
    constructor(randomPlayerID){
        this._color = "#ffffff"
        this._randomPlayerID = randomPlayerID;
        this._hand = new Array(0);
        this._eventHand = new Array(0);
        this._fleets = new Array(0);
        this._ownedNodes = new Array(0);
        this._userName = "Anon"
    }

    // Add a resource card to the players hand
    addResourceCard(resourceType) {
        this.hand.push(resourceType);
    }

    // TODO: Investigate why using get syntax for es6 returns undefined
    get color(){
        return this._color;
    }

    set color(color){
        if(color === "") this._userName = this.DEFAULT_COLOR;
        this._color = color;
    }

    get userName(){
        return this._userName;
    }

    set userName(userName){
        if(userName === "" ) this._userName = this.DEFAULT_USER_NAME // Makes sure default user name is Anon
        else this._userName = userName;
    }
}

//export default Player
module.exports = Player;