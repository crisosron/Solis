// Represents an entity which can be bought
class BuyableEntity{

    // Make sure a BuyableEntity cannot be directly instanciated, and has purchase method
    constructor(){

        this.price = null;

        if(new.target === BuyableEntity){
            throw new TypeError("Cannot construct Abstract BuyableEntity");
        }

        // Check has purchase method
        if(this.purchase === undefined){
            throw new TypeError("Must Override 'purchase' method");
        }
    }

}

export default BuyableEntity