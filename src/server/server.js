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
    client.on(CLIENT_REQUESTS.CREATE_GAME, data => {
        createGame(client, data);
    });

    // Leaving and joining rooms
    client.on(GAME_ROOM_EVENTS.REQUESTS.LEAVE_GAME_ROOM, data => {
        client.leave(data.gameID);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, data => {
        joinGameRoom(client, data);
    });

    client.on(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, data => {
        selectColorOption(client, data);
    });

    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

// --------------- CLIENT REQUEST HANDLING FUNCTIONS --------------- //
const createGame = (clientSocket, gameAttributes) => {

    // Creating a new game room and creating the player that created that game room
    let creatorUserName = gameAttributes.creatorUserName;
    let gameCreator = new Player(clientSocket.id, creatorUserName);
    let gameRoom = new GameRoom(generateGameID(), gameCreator);
    gameRoom.gameAttributes = gameAttributes;
    allPlayers.push(gameCreator);
    gameRooms.push(gameRoom);

    // Creates the room and subscribes clientSocket to the room
    clientSocket.join(gameRoom.gameID);

    // Replying to client with game id
    clientSocket.emit(SERVER_RESPONSES.STORE_GAME_ATTRIBUTES_ACCEPTED, {gameID: gameRoom.gameID, gameRoom: gameRoom});

}

const selectColorOption = (clientSocket, data) => {
    console.log("Inside selectColorOption method in server");
    console.log("Selecting player: ", clientSocket.id);
    let gameRoom = getGameRoomByGameID(data.gameID);
    let selectingPlayer = gameRoom.getPlayer(clientSocket.id);
    selectingPlayer.color = data.colorOption;
    console.log(selectingPlayer);
    io.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.COLOR_OPTION_SELECTED, {
        userName: selectingPlayer.userName,
        color: selectingPlayer.color
    });
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
    if (joinedGameRoom.hasDuplicateUserName(data.userName)) {
        clientSocket.emit(SERVER_RESPONSES.DUPLICATE_USER_NAME, {
            message: `${data.userName} has already been claimed by another player in the game room!`
        });
        return;
    }

    // Checks if the maximum number of players for the game room has been reached
    if(joinedGameRoom.hasMaxPlayers()){
        clientSocket.emit(SERVER_RESPONSES.MAX_PLAYERS_REACHED, {
            message: `The game room ${data.gameID} has no more room for new players!`
        });
        return;
    }

    // Subscribes the joining client to the room with the supplied gameID
    clientSocket.join(data.gameID);
    let joiningPlayer = new Player(clientSocket.id, data.userName);
    joinedGameRoom.addPlayer(joiningPlayer);
    console.log(`A player joined a GameRoom: ${joinedGameRoom.gameID}, num players in room: ${joinedGameRoom.players.length}`);

    // TODO: Explore if theres a way to make a template of the data argument required
    io.to(data.gameID).emit(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, {
        joiningPlayerUserNameColorMap: {
            userName: joiningPlayer.userName,
            color: joiningPlayer.color // Should have the value #fffffff at this instant
        }
    });

    // Enables redirecting in JoinGameMenu component
    clientSocket.emit(SERVER_RESPONSES.JOIN_GAME_REQUEST_ACCEPTED, {
        colorOptions: joinedGameRoom.playerColorOptions,
        userNameColorMap: joinedGameRoom.players.map(player => {
            return {
                userName: player.userName,
                color: player.color
            }
        })
    });
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