let GAME_ROOM_EVENTS = require("../gameRoomEvents");
let SERVER_RESPONSES = require("../serverResponses");
let EXCEPTIONS = require("./exceptions");
let Player = require("./player")

class LobbyOperations{

    /**
     * Processes the player joining a game room
     * @param {Object} clientSocket - Socket object of the client thats joining the game room
     * @param {Object} data - Information passed via socket io event
     * @param {Server} serverInstance - The {@link Server} instance that the game room being joined is associated with
    */
    static joinGameRoom(clientSocket, data, serverInstance){
        //if(inGameRoom(getPlayerFromSocket(client))) return; // Precondition that checks if the player is already in a room, cancel the operation
        // Precondition that checks the validity of the gameID supplied to this request
        if (!serverInstance.existingGameID(data.gameID)) {
            clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_REJECTED, {
                exception: EXCEPTIONS.INVALID_GAME_ID,
                message: "Game ID of " + data.gameID + " does not exist!"
            });
            return;
        }

        let joinedGameRoom = serverInstance.getGameRoomByGameID(data.gameID);

        // Checks if the userName supplied by the joining player is already in use by another player inside the game room being joined
        if (joinedGameRoom.hasDuplicateUserName(data.userName)) {
            clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_REJECTED, {
                exception: EXCEPTIONS.DUPLICATE_USER_NAME,
                message: `${data.userName} has already been claimed by another player in the game room!`
            });
            return;
        }

        // Checks if the maximum number of players for the game room has been reached
        if(joinedGameRoom.hasMaxPlayers()){
            clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_REJECTED, {
                exception: EXCEPTIONS.MAX_PLAYERS_REACHED,
                message: `The game room ${data.gameID} has no more room for new players!`
            });
            return;
        }

        // Subscribes the joining client to the room with the supplied gameID
        clientSocket.join(data.gameID);
        let joiningPlayer = new Player(clientSocket, data.userName);
        joinedGameRoom.addPlayer(joiningPlayer);
        joiningPlayer.setValueForAllResources(joinedGameRoom.gameAttributes.startingResources)

        serverInstance.serverIO.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, {
            userNameColorMap: joinedGameRoom.userNameColorMap,
            totalNumPlayers: joinedGameRoom.players.length
        });

        // At this instant, the joining player should still be in the JoinGameMenu component
        // This event will make it so that the joining player can redirect from the JoinGameMenu component
        // to the Lobby component that corresponds to the GameRoom they want to join.
        // The data being passed contains info about the current state of the GameRoom being joined and is
        // needed for the joining player so that their Lobby will look the same as all the other player's in the GameRoom
        clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_ACCEPTED, {
            colorOptions: joinedGameRoom.playerColorOptions,
            userNameColorMap: joinedGameRoom.userNameColorMap,
            messages: joinedGameRoom.messages,
            totalNumPlayers: joinedGameRoom.players.length,
            numPlayersReady: joinedGameRoom.numPlayersReady,
            maxPlayers: joinedGameRoom.gameAttributes.maxPlayers
        });
    }

    /**
     * Performs logic that need to be performed when a client leaves a game room
     * @param {Object} clientSocket - Socket object of the leaving client
     * @param {Object} data - Information passed via socket io event. Should contain gameID of the {@link GameRoom} being left by the client
     * @param {Server} serverInstance - The {@link Server} instance that the game room being left is associated with
    */
    static leaveGameRoom(clientSocket, data, serverInstance){
        let gameRoom = serverInstance.getGameRoomByGameID(data.gameID);
        let playerToRemove = gameRoom.getPlayer(clientSocket.id);
        gameRoom.removePlayer(playerToRemove);
        gameRoom.updateNumPlayersReady();
        clientSocket.leave(data.gameID);

        serverInstance.serverIO.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.PLAYER_LEFT, {
            userNameColorMap: gameRoom.userNameColorMap,
            totalNumPlayers: gameRoom.players.length,
            numPlayersReady: gameRoom.numPlayersReady
        });
    }

    /**
     * Performs server side logic when a client selects a color option
     * @param {Object} clientSocket - Socket object of the selecting client
     * @param {Object} data - Information passed via socket io event. Should containt gameID of the gameRoom that fired SELECT_COLOR_OPTION, and selectedColor
     * @param {Server} serverInstance - The {@link Server} instance relevant to the game room that fired the SELECT_COLOR_OPTION event
    */
    static selectColorOption(clientSocket, data, serverInstance){

        let gameRoom = serverInstance.getGameRoomByGameID(data.gameID);
        let selectingPlayer = gameRoom.getPlayer(clientSocket.id);

        // Player is not allowed to change colors, so if they already selected one, a request to select a color
        // should be rejected
        if(selectingPlayer.hasSelectedColor) {
            clientSocket.emit(GAME_ROOM_EVENTS.COLOR_OPTION_SELECTION_REJECTED)
            return;
        }

        // Updating the players color and the recorded mapping inside the GameRoom object the player is associated with
        selectingPlayer.color = data.selectedColor;
        selectingPlayer.hasSelectedColor = true;
        gameRoom.updateUserNameColorMapping(selectingPlayer.userName, selectingPlayer.color) // TODO: Should this be invoked inside the player class everytime the setter for color is called?

        // Updates the select status of the selected color of the game room for the server POV
        // This is important as it ensures that when joining players request the color options for the game room,
        // the selection status of the color options in this game room persist for newly joined players
        gameRoom.updateSelectedForColor(data.selectedColor, true);
        
        serverInstance.serverIO.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.COLOR_OPTION_SELECTED, {
            updatedColorOptions: gameRoom.playerColorOptions,
            updatedUserNameColorMap: gameRoom.userNameColorMap
        });

        clientSocket.emit(GAME_ROOM_EVENTS.RESPONSES.SET_CLIENT_HAS_SELECTED_COLOR);

    }

    /**
     * Performs the server side logic when a client sends a message to lobby chat
     * @param {Object} clientSocket - Socket object of the client sending the message
     * @param {Object} data - Information sent via socket io event. Should contain gameID of the {@link GameRoom} instance that is relevant to the sent message
     * @param {Server} serverInstance - The {@link Server} instance relevant to the {@link GameRoom} that is involved with the sent message
    */
    static sendMessage(clientSocket, data, serverInstance){
        let gameRoom = serverInstance.getGameRoomByGameID(data.gameID);
        let sendingPlayer = gameRoom.getPlayer(clientSocket.id);
        gameRoom.addMessage({
            senderUsername: sendingPlayer.userName,
            senderColor: sendingPlayer.color,
            message: data.message
        });
    
        serverInstance.serverIO.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.DISPLAY_MESSAGE, {
            messages: gameRoom.messages
        });
    }

    /**
     * 'Ready up' a player in a lobby. This method is trigerred when the client clicks the ready button in the {@link Lobby}
     * @param {Object} clientSocket - Socket object of the client readying up
     * @param {Object} data - Information sent via socket io event. Should contain gameID of the {@link GameRoom} instance that is relevant to the ready up event
     * @param {Server} serverInstance - The {@link Server} instance relevant to the {@link GameRoom} that is involved with the ready up event
    */
    static readyUp(clientSocket, data, serverInstance){
        let gameRoom = serverInstance.getGameRoomByGameID(data.gameID);
        let player = gameRoom.getPlayer(clientSocket.id);
        player.hasReadiedUp = true;
        gameRoom.updateNumPlayersReady();
        
        let gameCreator = gameRoom.gameCreator;
        gameCreator.socket.emit(GAME_ROOM_EVENTS.RESPONSES.READY_UP_CONFIRMED, {
            allPlayersReady: gameRoom.players.length === gameRoom.numPlayersReady
        });
        
        serverInstance.serverIO.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.UPDATE_READY_COUNT, {
            numPlayersReady: gameRoom.numPlayersReady
        });
    }
}

module.exports = LobbyOperations;