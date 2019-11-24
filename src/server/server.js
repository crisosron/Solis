const io = require('socket.io')();
const Player = require('./player');
const PORT_NUM = 8000;
let numClientsConnected = 0;

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);

const GAME_ID_LEN = 24;

let allUsers = [];

// A single GameRoom represents the current sessions that exist within the root namespace
let gameRooms = [];

io.on('connection', (client) => {
    console.log(client.id);
    numClientsConnected++;
    console.log('Number of clients connected so far: ', numClientsConnected);

    // A single user is a mapping from a user's socket and their player object
    const user = {
        clientSocket: client,
        player: new Player(client.id)
    }
    allUsers.push(user);

    // ---- Client requests ---- //
    client.on("create-game-id", () => {
        const gameID = generateGameID();
        const player = getPlayerFromSocket(client);
        let gameRoom = new GameRoom(gameID, player);
        gameRooms.push(gameRoom);
        client.join(gameID); // Creates a room and subscribe the game generating player to that room
        console.log(`GameRoom created: ${gameRoom.gameID}, num players in room: ${gameRoom.players.length}`);
        client.emit("game-id-delivery", {gameID: gameID}); // Sends the generated game id back to the client that requested it
    });

    // Leaving and joining rooms
    client.on("leave-game-room", (data) => {
        client.leave(data.gameID);
    });

    client.on("join-game-room", (data) => {
        //if(inGameRoom(getPlayerFromSocket(client))) return; // Precondition that checks if the player is already in a room, cancel the operation

        // Precondition that checks the validity of the gameID supplied to this request
        if(!existingGameID(data.gameID)) {
            client.emit("invalid-game-id-entered", {message: "Game ID of " + data.gameID + " does not exist!"});
            return;
        }
        client.join(data.gameID);
        console.log(`Joining room succesful`);
        let joinedGameRoom = getGameRoomByGameID(data.gameID);
        joinedGameRoom.addPlayer(getPlayerFromSocket(client));
        console.log(`Joined GameRoom: ${joinedGameRoom.gameID}, num players in room: ${joinedGameRoom.players.length}`);
    });

    // TODO: Use sockets join to add associate players to the same game lobby when they try to join a game
    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

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
    for(let i = 0; i < allUsers.length; i++){
        if(allUsers[i].clientSocket === playerSocket) return allUsers[i].player;
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

class GameRoom{
    constructor(gameID, gameCreator){
        this._gameID = gameID;
        this._players = [gameCreator];
    }

    get gameID(){
        return this._gameID;
    }

    get players(){
        return this._players;
    }

    addPlayer(player){
        this._players.push(player);
    }

    // TODO: Executing this function leads to undefined for some reason. Fix it.
    printDetails(){
        console.log(`gameID: ${this._gameID}, # of players in room: ${this._players.length}`);
    }
}