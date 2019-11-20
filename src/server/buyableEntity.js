// Represents an entity which can be bought
class BuyableEntity{

    // Make sure a BuyableEntity cannot be directly instanciated
    constructor(){
        if(new.target === BuyableEntity){
            throw new TypeError("Cannot construct Abstract BuyableEntity");
        }
    }

}

export default BuyableEntity