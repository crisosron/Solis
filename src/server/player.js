// Represents a player within the game
class Player {
    constructor(socketID, userName = "Anon"){
        this._color = "#ffffff";
        this._socketID = socketID;
        this._hand = new Array(0);
        this._eventHand = new Array(0);
        this._fleets = new Array(0);
        this._ownedNodes = new Array(0);
        this._userName = userName;
    }

    // Add a resource card to the players hand
    addResourceCard(resourceType) {
        this.hand.push(resourceType);
    }

    get socketID(){
        return this._socketID;
    }

    // TODO: Investigate why using get syntax for es6 returns undefined - See Issue #2
    get color(){
        return this._color;
    }

    set color(color){
        this._color = color;
    }

    get userName(){
        return this._userName;
    }

    set userName(userName){
        this._userName = userName;
    }
}

module.exports = Player;