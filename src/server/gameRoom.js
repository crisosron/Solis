/**
 * Represents a socket room, where the member sockets are the sockets of Player instances in the same game. 
 * 
*/
class GameRoom{

    /** 
    * @constructor
    * @param {string} gameID - A string of randomly generated numbers that identifies this GameRoom
    * @param {Player} gameCreator - Player instance that created a game to generate this GameRoom instance
    */
    constructor(gameID, gameCreator){
        this._gameID = gameID;
        this._players = [gameCreator];
        this._gameAttributes = null;
        this._playerColorOptions =  this.generateRandomColors();
    }

    /**
     * Creates random color options that players in this GameRoom can choose from
     * @returns An array of strings that represent colors in hexadecimal format
    */
    generateRandomColors() {
        const numColorsAvailable = 16;

        // Populating a collection of randomly generated colors
        let randomlyGeneratedColors = [];
        for (let i = 0; i < numColorsAvailable; i++) {
            let randomColor = this.createRandomColor();

            // Check if random color is already in the array of randomly generated colors
            if (randomlyGeneratedColors.includes(randomColor)) {
                i--;
                continue;
            }

            randomlyGeneratedColors.push(randomColor);
        }

        return randomlyGeneratedColors;
    };

    /**
     * Creates a string that represents a single color in hexadecimal format
     * @returns A string that represents a single color in hexadecimal format
    */
    createRandomColor() {
        const characters = "0123456789ABCDEF";
        let randomColor = "#";
        for (let i = 0; i < 6; i++)
        randomColor += characters[Math.floor(Math.random() * characters.length)];
        return randomColor;
    };

    /**
     * Adds a player to this GameRoom
     * @param {Player} player - Player object to add to this GameRoom
    */
    addPlayer(player){
        this._players.push(player);
    }

    /**
     * Iterates through all players in this GameRoom to see if the username parameter matches
     * the username of any of the players
     * @param {String} userName - Username to check duplicates against
     * @returns True of the userName parameter matches the username of a player
    */
    hasDuplicateUserName(userName){
        console.log("Checking for duplicates");
        for(let i = 0; i < this._players.length; i++){
            let player = this._players[i];
            if(player.userName === userName) return true;
        }
        return false;
    }

    get gameID(){
        return this._gameID;
    }

    get players(){
        return this._players;
    }

    get gameAttributes(){
        return this._gameAttributes;
    }

    get playerColorOptions(){
        return this._playerColorOptions;
    }

    set gameAttributes(gameAttributes){
        this._gameAttributes = gameAttributes;
    }
}

module.exports = GameRoom;