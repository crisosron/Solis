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
        this._userNameColorMap = [];
        this._messages = [];

        // Username color mapping is initialized with the game creator
        this._userNameColorMap = [{
            userName: gameCreator.userName,
            color: gameCreator.color // When the player object is created, their color property is set to #fff as the default color
        }];
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
            let randomColor = this.createRandomColorOption();

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
    createRandomColorOption() {
        const characters = "0123456789ABCDEF";
        let randomColor = "#";
        for (let i = 0; i < 6; i++)
        randomColor += characters[Math.floor(Math.random() * characters.length)];
        return {
            color: randomColor,
            selected: false
        };
    };

    /**
     * Adds a player to this GameRoom while also creating a color mapping to the player's user name
     * @param {Player} player - Player object to add to this GameRoom
    */
    addPlayer(player){
        this._players.push(player);
        this._userNameColorMap.push({
            userName: player.userName,
            color: player.color // Should be #fff at this instant since the player parameter is new
        });
    }

    addMessage(message){
        // TODO: Should there be a limit placed on the number of messages that is stored on the client side?
        this._messages.push(message);   
    }

    /**
     * Iterates through all players in this GameRoom to see if the username parameter matches
     * the username of any of the players
     * @param {String} userName - Username to check duplicates against
     * @returns True of the userName parameter matches the username of a player
    */
    hasDuplicateUserName(userName){
        for(let i = 0; i < this._players.length; i++){
            let player = this._players[i];
            if(player.userName === userName) return true;
        }
        return false;
    }

    hasMaxPlayers(){
    
        // + 1 because this method is used to check whether or not this game room can accommodate another player trying to join
        return this._gameAttributes.maxPlayers < this._players.length + 1;
    }

    getPlayer(playerSocketID){
        for(let i = 0; i < this._players.length; i++){
            if(this._players[i].socketID === playerSocketID) return this._players[i];
        }
    }

    updateUserNameColorMapping(userName, color){
        // TODO: Observe immutability?
        for(let i = 0; i < this._userNameColorMap.length; i++){
            let mapping = this._userNameColorMap[i];
            if(mapping.userName === userName){
                mapping.color = color;
                return;
            }
        }
    }

    updateSelectedForColor(color, selectedValue){
        // TODO: Observe immutability?
        for(let i = 0; i < this._playerColorOptions.length; i++){
            let colorOption = this._playerColorOptions[i];
            if(colorOption.color === color) {
                colorOption.selected = selectedValue;
                return;
            }
        }
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

    get messages(){
        return this._messages;
    }

    set messages(messages){
        this._messages = messages;
    }

    get userNameColorMap(){
        return this._userNameColorMap;
    }

    set userNameColorMap(userNameColorMap){
        this._userNameColorMap = userNameColorMap;
    }
}

module.exports = GameRoom;