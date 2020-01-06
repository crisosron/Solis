// Represents a player within the game
class Player {
    constructor(socket, userName){
        this._color = "#ffffff"; // Default color is white
        this._socket = socket;
        this._hand = new Array(0);
        this._eventHand = new Array(0);
        this._fleets = new Array(0);
        this._ownedNodes = new Array(0);
        this._userName = userName;
        this._hasSelectedColor = false
        this._hasReadiedUp = false;
        this._resources = {
            minerals: 0,
            manpower: 0,
            darkMatter: 0,
            alloys: 0,
            fuelCells: 0
        }
    }

    // Add a resource card to the players hand
    addResourceCard(resourceType) {
        this.hand.push(resourceType);
    }

    setValueForAllResources(value){
        let valueAsNum = Number(value);
        if(isNaN(valueAsNum)){
            //TODO: Throw exception
            console.log("Error casting value");
            return; 
        }

        this._resources = {
            minerals: value,
            manpower: value,
            darkMatter: value,
            alloys: value,
            fuelCells: value
        }
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

    get resources(){
        return this._resources;
    }

    set resources(resources){
        this._resources = resources;
    }
}

module.exports = Player;