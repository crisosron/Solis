// Represents a player within the game
class Player {
    constructor(socket, userName = "Anon"){
        this._color = "#ffffff";
        this._socket = socket;
        this._hand = new Array(0);
        this._eventHand = new Array(0);
        this._fleets = new Array(0);
        this._ownedNodes = new Array(0);
        this._userName = userName;
        this._hasSelectedColor = false
        this._hasReadiedUp = false;
    }

    // Add a resource card to the players hand
    addResourceCard(resourceType) {
        this.hand.push(resourceType);
    }

    get socket(){
        return this._socket;
    }

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

    get hasSelectedColor(){
        return this._hasSelectedColor;
    }

    set hasSelectedColor(hasSelectedColor){
        this._hasSelectedColor = hasSelectedColor;
    }

    get hasReadiedUp(){
        return this._hasReadiedUp;
    }

    set hasReadiedUp(hasReadiedUp){
        this._hasReadiedUp = hasReadiedUp;
    }
}

module.exports = Player;