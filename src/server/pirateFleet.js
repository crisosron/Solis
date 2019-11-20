import Fleet from "./Fleet";

// Represents a pirate fleet
class PirateFleet extends Fleet{

    constructor(startNode){
        super()

        let destroyed = false;

        // If startNode contains fleets, do combat
        if(startNode.containsFleets()){
            //TODO combat
        }

        // If now destroyed, stop
        if(destroyed) return;

        // If the start node contains a colony, pillage it
        if(startNode.containsColony()){
            this.pillaging = true;
            //TODO
        }
    }
}

export default PirateFleet