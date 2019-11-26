const io = require('socket.io')();
let Player = require('./player.js');
let GameRoom = require('./gameRoom.js');
const PORT_NUM = 8000;
let numClientsConnected = 0;

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);
const GAME_ID_LEN = 24;

const GAME_ROOM_EVENTS = {
    PLAYER_JOINED: 1,
    PLAYER_CHANGED_USER_NAME: 2,
    PLAYER_CHANGED_COLOR: 3
}

let allPlayers = [];

// A single GameRoom represents the current sessions that exist within the root namespa ce
let gameRooms = [];

io.on('connection', (client) => {
    numClientsConnected++;
    console.log('Number of clients connected so far: ', numClientsConnected);

    // ---- Client requests ---- //
    client.on("create-game-id", data => {
        createGameID(client, data);
    });

    client.on("store-game-attributes", (data) => {
        storeGameAttributes(data);
    });

    // Leaving and joining rooms
    client.on("leave-game-room", (data) => {
        client.leave(data.gameID);
    });

    client.on("join-game-room", (data) => {
        joinGameRoom(client, data);
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
    clientSocket.emit("game-id-delivery", {gameID: gameID}); // Sends the generated game id back to the client that requested it

    // Triggers an event to all sockets in the newly created room (only the game generating player will be in it when this event is trigerred)
    emitToGameRoom(gameID, GAME_ROOM_EVENTS.PLAYER_JOINED, {joinedPlayerUserName: player.userName});
}

const storeGameAttributes = gameAttributes => {
    console.log("Received request from client: `store-game-settings`");
}

const joinGameRoom = (clientSocket, data) => {
     //if(inGameRoom(getPlayerFromSocket(client))) return; // Precondition that checks if the player is already in a room, cancel the operation

    // Precondition that checks the validity of the gameID supplied to this request
    if(!existingGameID(data.gameID)) {
        clientSocket.emit("invalid-game-id-entered", {message: "Game ID of " + data.gameID + " does not exist!"});
        return;
    }

    clientSocket.join(data.gameID);
    let joinedGameRoom = getGameRoomByGameID(data.gameID);
    let joiningPlayer = new Player(clientSocket.id);
    joinedGameRoom.addPlayer(joiningPlayer);
    console.log(`A player joined a GameRoom: ${joinedGameRoom.gameID}, num players in room: ${joinedGameRoom.players.length}`);

    // TODO: Explore if theres a way to make a template of the data argument required
    emitToGameRoom(data.gameID, GAME_ROOM_EVENTS.PLAYER_JOINED, {joinedPlayerUserName: joiningPlayer.userName});
}


// --------------- HELPER FUNCTIONS --------------- //
const emitToGameRoom = (gameID, event, dataToSend) => {
    switch (event){
        case GAME_ROOM_EVENTS.PLAYER_JOINED:
            io.to(gameID).emit("player-joined", dataToSend);
            break;
        case GAME_ROOM_EVENTS.PLAYER_CHANGED_USER_NAME:
            io.to(gameID).emit("player-changed-user-name", dataToSend);
            break;
        case GAME_ROOM_EVENTS.PLAYER_CHANGED_COLOR:
            io.to(gameID).emit("player-changed-color", dataToSend); 
            break;
        default: 
            throw new Error("GAME_ROOM_EVENT " + event + " not found" );
    }
}

const inGameRoom = player =>{
    for(let i = 0; i < gameRooms.length; i++ ){
        const gameRoom = gameRooms[i];
        if(gameRoom.players.includes(player)) return true;
    }
    return false;
}

const existingGameID = gameID => {
    for(let i = 0; i < gameRooms.length; i++){
        if(gameRooms[i].gameID === gameID) return true;
    }
    return false;
}

const getPlayerFromSocket = playerSocket => {
    for(let i = 0; i < allPlayers.length; i++){
        if(allPlayers[i].socketID === playerSocket.id) return allPlayers[i];
    }
}

const getGameRoomByGameID = gameID => {
    for(let i = 0; i < gameRooms.length; i++){
        if(gameRooms[i].gameID === gameID) return gameRooms[i];
    }
}

const generateGameID = () => {
    let gameID = "";
    for(let i = 0; i < GAME_ID_LEN; i++) gameID += Math.floor(Math.random() * 10);
    return gameID;
}