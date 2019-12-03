const io = require('socket.io')();
let Player = require('./player.js');
let GameRoom = require('./gameRoom.js');

// Event Modules - These are essentially just enums in a nested object structure with strings
let CLIENT_REQUESTS = require("../clientRequests");
let SERVER_RESPONSES = require("../serverResponses");
let GAME_ROOM_EVENTS = require("../gameRoomEvents");

const PORT_NUM = 8000;
const GAME_ID_LEN = 5;
let numClientsConnected = 0;
let allPlayers = [];

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);

// A single GameRoom represents the current sessions that exist within the root namespa ce
let gameRooms = [];

io.on('connection', (client) => {
    numClientsConnected++;
    console.log("Number of clients connected so far: ", numClientsConnected);

    // ---- Client requests ---- //
    client.on(CLIENT_REQUESTS.CREATE_GAME_ID, data => {
        createGameID(client, data);
    });

    client.on(CLIENT_REQUESTS.STORE_GAME_ATTRIBUTES, data => {
        storeGameAttributes(data.gameID, data);
    });

    // Leaving and joining rooms
    client.on(GAME_ROOM_EVENTS.REQUESTS.LEAVE_GAME_ROOM, data => {
        client.leave(data.gameID);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, data => {
        joinGameRoom(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.UPDATE_STATE, data => {
        console.log("Request to UPDATE_STATE has been received with data: ", data);
    });

    // TODO: Use sockets join to add associate players to the same game lobby when they try to join a game
    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

// --------------- CLIENT REQUEST HANDLING FUNCTIONS --------------- //
const createGameID = (clientSocket, data) => {
    const gameID = generateGameID();
    let creatorUserName = data.creatorUserName == null || data.creatorUserName === "" ? "Anon" : data.creatorUserName;
    let player = new Player(clientSocket.id, creatorUserName);
    allPlayers.push(player);

    let gameRoom = new GameRoom(gameID, player);
    gameRooms.push(gameRoom);
    clientSocket.join(gameID); // Creates a room and subscribes the game generating player to that room
    //console.log(gameRoom.colorOptions);

    // Sends the generated game id back to the client that requested it
    clientSocket.emit(SERVER_RESPONSES.GAME_ID_DELIVERY, {
        gameID: gameID,
        colorOptions: gameRoom.playerColorOptions
    });

    // Triggers an event to all sockets in the newly created room (only the game generating player will be in it when this event is trigerred)
    io.to(gameID).emit(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, {
        joinedPlayerUserName: player.userName,
    });

}

const storeGameAttributes = (gameID, gameAttributes) => {
    let gameRoom = getGameRoomByGameID(gameID);
    gameRoom.gameAttributes = gameAttributes;
}

/**
 * Function that processes the logic behind a player joining a game room
 * @param {object} clientSocket - The socket of the joining player
 * @param {object} data - Data received by the server to be processed. Data in this case should contain gameID to join, and userName of the joining player
 */
const joinGameRoom = (clientSocket, data) => {
    //if(inGameRoom(getPlayerFromSocket(client))) return; // Precondition that checks if the player is already in a room, cancel the operation
    // Precondition that checks the validity of the gameID supplied to this request
    if (!existingGameID(data.gameID)) {
        clientSocket.emit(SERVER_RESPONSES.INVALID_GAME_ID_ENTERED, {
            message: "Game ID of " + data.gameID + " does not exist!"
        });
        return;
    }

    let joinedGameRoom = getGameRoomByGameID(data.gameID);

    // Checks if the userName supplied by the joining player is already in use by another player inside the game room being joined
    if(joinedGameRoom.hasDuplicateUserName(data.userName)){
        clientSocket.emit(SERVER_RESPONSES.DUPLICATE_USER_NAME, {message: `${data.userName} has already been claimed by another player in the game room!`});
        return;
    }

    // Subscribes the joining client to the room with the supplied gameID
    clientSocket.join(data.gameID);
    let joiningPlayer = new Player(clientSocket.id, data.userName);
    joinedGameRoom.addPlayer(joiningPlayer);
    console.log(`A player joined a GameRoom: ${joinedGameRoom.gameID}, num players in room: ${joinedGameRoom.players.length}`);

    // TODO: Explore if theres a way to make a template of the data argument required
    io.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, {
        joinedPlayerUserName: joiningPlayer.userName,
    });

    // Enables redirecting in JoinGameMenu component
    clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_ACCEPTED);
}

// --------------- HELPER FUNCTIONS --------------- //
const inGameRoom = player => {
    for (let i = 0; i < gameRooms.length; i++) {
        const gameRoom = gameRooms[i];
        if (gameRoom.players.includes(player)) return true;
    }
    return false;
}

const existingGameID = gameID => {
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].gameID === gameID) return true;
    }
    return false;
}

const getPlayerFromSocket = playerSocket => {
    for (let i = 0; i < allPlayers.length; i++) {
        if (allPlayers[i].socketID === playerSocket.id) return allPlayers[i];
    }
}

const getGameRoomByGameID = gameID => {
    for (let i = 0; i < gameRooms.length; i++) {
        if (gameRooms[i].gameID === gameID) return gameRooms[i];
    }
}

const generateGameID = () => {
    let gameID = "";
    for (let i = 0; i < GAME_ID_LEN; i++) gameID += Math.floor(Math.random() * 10);
    return gameID;
}