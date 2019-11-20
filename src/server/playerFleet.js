import Fleet from "./Fleet";

// Represents a Players Fleet
class PlayerFleet extends Fleet{

    constructor(player){
        super();
        this.owner = player;
    }

    // Change fleets position to a new node
    move(newNode){
        this.position = newNode;
    }

}

export default PlayerFleet