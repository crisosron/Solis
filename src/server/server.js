const io = require('socket.io')();
let Player = require('./player.js');
let GameRoom = require('./gameRoom.js');

// Event Modules - These are essentially just enums in a nested object structure with strings
let CLIENT_REQUESTS = require("../clientRequests");
let SERVER_RESPONSES = require("../serverResponses");
let GAME_ROOM_EVENTS = require("../gameRoomEvents");
let EXCEPTIONS = require("./exceptions");

let LobbyOperations = require("./lobbyOperations");

const PORT_NUM = 8000;
const GAME_ID_LEN = 5;
let numClientsConnected = 0;
let allPlayers = [];

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);

// A single GameRoom represents the current sessions that exist within the root namespa ce
let gameRooms = [];

let serverHelper = {
    existingGameID: function(gameID){
        for (let i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].gameID === gameID) return true;
        }
        return false;
    },

    getGameRoomByGameID: function(gameID){
        for (let i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].gameID === gameID) return gameRooms[i];
        }
    }    
}

io.on('connection', (client) => {
    numClientsConnected++;
    console.log("Number of clients connected so far: ", numClientsConnected);

    // ---- Client requests ---- //
    client.on(CLIENT_REQUESTS.CREATE_GAME, data => {
        createGame(client, data);
    });

    // Leaving and joining rooms
    client.on(GAME_ROOM_EVENTS.REQUESTS.LEAVE_GAME_ROOM, data => {
        LobbyOperations.leaveGameRoom(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, data => {
        LobbyOperations.joinGameRoom(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, data => {
        LobbyOperations.selectColorOption(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.SEND_MESSAGE, data => {
        LobbyOperations.sendMessage(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.READY_UP, data => {
        LobbyOperations.readyUp(client, data);
    });

    client.on(CLIENT_REQUESTS.GET_CREATOR_SOCKET_ID, data => {
        let gameRoom = getGameRoomByGameID(data.gameID);
        client.emit(SERVER_RESPONSES.CREATOR_SOCKET_ID_DELIVERY, {
            creatorSocketID: gameRoom.gameCreator.socket.id
        });
    })

    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

// --------------- CLIENT REQUEST HANDLING FUNCTIONS --------------- //
const createGame = (clientSocket, gameAttributes) => {

    // Creating a new game room and creating the player that created that game room
    let creatorUserName = gameAttributes.creatorUserName;
    let gameCreator = new Player(clientSocket, creatorUserName);
    let gameRoom = new GameRoom(generateGameID(), gameCreator);
    gameRoom.gameAttributes = gameAttributes;
    allPlayers.push(gameCreator);
    gameRooms.push(gameRoom);

    // Creates the room and subscribes clientSocket to the room
    clientSocket.join(gameRoom.gameID);

    // Replying to client with game id
    clientSocket.emit(SERVER_RESPONSES.STORE_GAME_ATTRIBUTES_ACCEPTED, {gameID: gameRoom.gameID, colorOptions: gameRoom.playerColorOptions, userNameColorMap: gameRoom.userNameColorMap, messages: gameRoom.messages});

}

// --------------- HELPER FUNCTIONS --------------- //
const inGameRoom = player => {
    for (let i = 0; i < gameRooms.length; i++) {
        const gameRoom = gameRooms[i];
        if (gameRoom.players.includes(player)) return true;
    }
    return false;
}

// function existingGameID(gameID){
//     for (let i = 0; i < gameRooms.length; i++) {
//         if (gameRooms[i].gameID === gameID) return true;
//     }
//     return false;
// }

const getPlayerFromSocket = playerSocket => {
    for (let i = 0; i < allPlayers.length; i++) {
        if (allPlayers[i].socketID === playerSocket.id) return allPlayers[i];
    }
}

function getGameRoomByGameID(gameID){
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].gameID === gameID) return gameRooms[i];
    }
}

function generateGameID() {
    let gameID = "";
    for (let i = 0; i < GAME_ID_LEN; i++) gameID += Math.floor(Math.random() * 10);
    return gameID;
}

module.exports = {
    serverHelper,
    io
};