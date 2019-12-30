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
        this._gameCreator = gameCreator;
        this._players = [gameCreator];
        this._gameAttributes = null;
        this._colors = [
            "#FF7979", "#E84B4B", "#D91F1F", "#AC0F0F", // Reds
            "#AEE96f", "#8ED244", "#74C51C", "#579B0E", // Greens
            "#5D7CB0", "#3B5E9A", "#204A90", "#143772", // Blues
            "#FFF879", "#E8DF4B", "#D9CF1F", "#ACA30F" // Yellows
        ];
        this._playerColorOptions = this.setupColorOptions();
        this._userNameColorMap = [];
        this._messages = [];
        this._numPlayersReady = 0;

        // Username color mapping is initialized with the game creator
        this._userNameColorMap = [{
            userName: gameCreator.userName,
            color: gameCreator.color // When the player object is created, their color property is set to #fff as the default color
        }];
    }

    setupColorOptions(){
        let colorOptions = [];
        this._colors.forEach(color => {
            colorOptions.push({
                color: color,
                selected: false
            });
        });
        return colorOptions;
    }

    /**
     * Adds a player to this GameRoom while also creating a color mapping to the player's user name
     * @param {Player} player - Player object to add to this GameRoom
    */
    addPlayer(player){
        // TODO: Observe immutability?
        this._players.push(player);
        this._userNameColorMap.push({
            userName: player.userName,
            color: player.color // Should be #fff at this instant since the player parameter is new
        });
    }

    /**
     * Removes the given player from this GameRoom
     * @param {Player} player - Player object to remove from this GameRoom
    */
    removePlayer(player){
        let playerToRemoveIndex = -1;

        // Looping through the players to determine which one matches the player to remove
        for(let i = 0; i < this._players.length; i++){
            let playerIter = this._players[i];
            if(playerIter.socket.id === player.socket.id){
                playerToRemoveIndex = i;
                break;
            } 
        }

        if(playerToRemoveIndex === -1){
            // TODO: Throw error
            console.log("Failed to remove player - Player not found in game room");
            return;
        }

        // Removing player from players array
        this._players.splice(playerToRemoveIndex, 1);

        // Looping through mappings to see determine the index of the mapping to remove
        let mappingToRemoveIndex = -1;
        for(let i = 0; i < this._userNameColorMap.length; i++){
            let mapping = this._userNameColorMap[i];
            if(mapping.userName === player.userName){ // TODO: Do we need to use socket id to uniquely identify a player in a game room when the names alone should be unique?!?!?!
                mappingToRemoveIndex = i;
                break;
            }
        }

        if(mappingToRemoveIndex === -1){
            // TODO: Throw error
            console.log("Failed to update userNameColorMapping - Player not found in game room");
            return;
        }

        // Removing the mapping from userNameColorMap
        this._userNameColorMap.splice(mappingToRemoveIndex, 1);
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

    /**
     * Determines if the maximum number of players for this GameRoom has been reached
     * @returns true if this GameRoom has reached the maximum number of players
    */
    hasMaxPlayers(){
    
        // + 1 because this method is used to check whether or not this game room can accommodate another player trying to join
        return this._gameAttributes.maxPlayers < this._players.length + 1;
    }

    /**
     * Obtains a {@link Player} object in this GameRoom from the socket id parameter
     * @param {string} playerSocketID - Socket id of the player to obtain
    */
    getPlayer(playerSocketID){
        for(let i = 0; i < this._players.length; i++){
            let player = this._players[i];
            if(player.socket.id === playerSocketID) return player;
        }
    }

    /**
     * Updates the user name - color mapping for supplied user name and color
     * @param {string} userName - Username of the player whos color mapping needs to be updated
     * @param {string} color - New hexadecimal color value to map to the username
    */
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

    /**
     * Updates the selected status of the color for this GameRoom
     * @param {string} color - Color that was selected in hexadecimal
     * @param {boolean} selectedValue - Select status to set for the color
    */
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

    /**
     * Updates the number of players that have readied up in this GameRoom
    */
    updateNumPlayersReady(){
        let numPlayersReady = 0;
        for(let i = 0; i < this._players.length; i++){
            let player = this._players[i];
            if(player.hasReadiedUp) numPlayersReady++;
        }

        this._numPlayersReady = numPlayersReady;
    }

    get gameID(){
        return this._gameID;
    }

    get players(){
        return this._players;
    }

    get gameCreator(){
        return this._gameCreator;
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

    get numPlayersReady(){
       return this._numPlayersReady;
    }

    set numPlayersReady(numPlayersReady){
        this._numPlayersReady = numPlayersReady;
    }
}

module.exports = GameRoom;