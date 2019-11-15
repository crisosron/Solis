// Represents a player within the game
class Player {

    // Construct a Player, setting all fields to null / Empty arrays
    constructor(){
        this.color = null;
        this.hand = new Array(0);
        this.eventHand = new Array(0);
        this.fleets = new Array(0);
        this.ownedNodes = new Array(0);
    }

    // Add a resource card to the players hand
    addResourceCard(resourceType) {
        this.hand.push(resourceType);
    }


}

export default Player