import BuyableEntity from "./buyableEntity";

// Represents a colony within a node
class Colony extends BuyableEntity{

    // Construc a colony at a node
    constructor(node){
        super();
        this.location = node;
        this.tier = 1;
    }

    // Downgrade the colony
    downGrade(){
        // If tier is greater than 1, reduce it
        if(this.tier > 1){
            this.tier --;
        }

        // Else destroy the colony
        else{
            this.location.removeColony();
        }
    }

}

export default Colony