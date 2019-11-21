// Represents an event that impacts the current player
class Event{

    // Check not directly instanciated and has activate method
    constructor(){

        // Make sure an Event cannot be directly instanciated
        if(new.target === Event){
            throw new TypeError("Cannot construct Abstract Event");
        }

        // Check methods
        if(this.activate === undefined){
            throw new TypeError("Must Override 'activate' method");
        }
    }

    

}

export default Event