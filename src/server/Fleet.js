// Represents an abstract fleet, which can fight other fleets and colonies
class Fleet{
    
    // Require methods be defined and construction target is NOT Fleet
    constructor(){

        this.owner = null;
        this.size = 0;
        this.sieging = false;
        this.pillaging = false;

        // Check Target
        if(new.target === Fleet){
            throw new TypeError("Cannot construct Abstract Fleet");
        }

        // Check methods
        if(this.move === undefined){
            throw new TypeError("Must Override 'move' method");
        }

    }

}

export default Fleet