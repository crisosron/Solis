let Player = require('./player.js');
let GameRoom = require('./gameRoom.js');

// Event Modules - These are essentially just enums in a nested object structure with strings
let CLIENT_REQUESTS = require("../clientRequests");
let SERVER_RESPONSES = require("../serverResponses");
let GAME_ROOM_EVENTS = require("../gameRoomEvents");
let LobbyOperations = require("./lobbyOperations");

const PORT_NUM = 8000;
const GAME_ID_LEN = 5;
class Server{
    constructor(){
        this.serverIO = require("socket.io")();
        this._numClientsConnected = 0;
        this._allPlayers = [];
        this._gameRooms = [];
        this.serverIO.listen(PORT_NUM);
        console.log("Listening for connections on port ", PORT_NUM);
        this.initClientListening();
    }

    initClientListening(){
        this.serverIO.on("connection", client => {
            this._numClientsConnected++;
            console.log("Number of clients connected so far: ", this._numClientsConnected);

            client.on(CLIENT_REQUESTS.CREATE_GAME, data => {
                this.createGame(client, data, this);
            });

            client.on(GAME_ROOM_EVENTS.REQUESTS.LEAVE_GAME_ROOM, data => {
                LobbyOperations.leaveGameRoom(client, data, this);
            });
        
            client.on(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, data => {
                LobbyOperations.joinGameRoom(client, data, this);
            });
        
            client.on(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, data => {
                LobbyOperations.selectColorOption(client, data, this);
            });
        
            client.on(GAME_ROOM_EVENTS.REQUESTS.SEND_MESSAGE, data => {
                LobbyOperations.sendMessage(client, data, this);
            });
        
            client.on(GAME_ROOM_EVENTS.REQUESTS.READY_UP, data => {
                LobbyOperations.readyUp(client, data, this);
            });

            client.on(CLIENT_REQUESTS.GET_CREATOR_SOCKET_ID, data => {
                let gameRoom = this.getGameRoomByGameID(data.gameID);
                client.emit(SERVER_RESPONSES.CREATOR_SOCKET_ID_DELIVERY, {
                    creatorSocketID: gameRoom.gameCreator.socket.id
                });
            })

            this.serverIO.on('disconnect', () => {
                console.log('Client disconnected');
                this._numClientsConnected--;
            });
        });
    }

    /**
     * Creates and returns a  random gameID
     * @returns A randomly generated string that represents a game id for a game room
    */
    generateGameID(){
        let gameID = "";
        for (let i = 0; i < GAME_ID_LEN; i++) gameID += Math.floor(Math.random() * 10);
        return gameID;
    }

    /**
     * Creates a {@link GameRoom}
     * @param {Object} clientSocket - Socket object of the client creating the {@link GameRoom}
     * @param {Object} gameAttributes - Settings of the {@link GameRoom} instance to be created
    */
    createGame(clientSocket, gameAttributes){
        // Creating a new game room and creating the player that created that game room
        let creatorUserName = gameAttributes.creatorUserName;
        let gameCreator = new Player(clientSocket, creatorUserName);
        let gameRoom = new GameRoom(this.generateGameID(), gameCreator);
        gameRoom.gameAttributes = gameAttributes;
        this._allPlayers.push(gameCreator);
        this._gameRooms.push(gameRoom);

        // Creates the room and subscribes clientSocket to the room
        clientSocket.join(gameRoom.gameID);

        // Replying to client with game id
        clientSocket.emit(SERVER_RESPONSES.STORE_GAME_ATTRIBUTES_ACCEPTED, {gameID: gameRoom.gameID, colorOptions: gameRoom.playerColorOptions, userNameColorMap: gameRoom.userNameColorMap, messages: gameRoom.messages});

    }

    /**
     * Checks if the gameID parameter is already in use by another {@link GameRoom} instance
     *  @param {string} gameID - gameID to check
    */
    existingGameID(gameID){
        for (let i = 0; i < this._gameRooms.length; i++) {
            if (this._gameRooms[i].gameID === gameID) return true;
        }
        return false;
    }

    /**
     * Obtains a {@link GameRoom} instance based on the gameID parameter
     * @param {string} gameID - gameID of the {@link GameRoom} instance to get
    */
    getGameRoomByGameID(gameID){
        for (let i = 0; i < this._gameRooms.length; i++) {
            if (this._gameRooms[i].gameID === gameID) return this._gameRooms[i];
        }
    }

}

const server = new Server();
