const io = require('socket.io')();
const Player = require('./player');
const PORT_NUM = 8000;
let numClientsConnected = 0;

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);

const GAME_ID_LEN = 24;

let allUsers = [];

// Array of game IDs. Each game ID represents an active game session
let gameIDs = [];

io.on('connection', (client) => {
    numClientsConnected++;
    console.log('Number of clients connected so far: ', numClientsConnected);

    const user = {
        clientSocket: client,
        player: new Player(generatePlayerID())
    }
    allUsers.push(user);

    // ---- Client requests ---- //
    client.on("create-game-id", () => {
        const gameID = generateGameID();
        gameIDs.push(gameID);
        client.emit("game-id-delivery", {gameID: gameID}); // Sends the generated game id back to the client that requested it
    });

    // TODO: Use sockets join to add associate players to the same game lobby when they try to join a game

    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

const generateGameID = () => {
    let gameID = "";
    for(let i = 0; i < GAME_ID_LEN; i++) gameID += Math.floor(Math.random() * 10);
    return gameID;
}

const generatePlayerID = () => {
    let playerID = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < GAME_ID_LEN; i++) {
        let randomNum = Math.floor(Math.random() * 10);
        
        // If randomNumber is even, select a character, else insert the randomNumber into the player id
        if(randomNum % 2 === 0) playerID += alphabet[randomNum];
        else playerID +=  randomNum;
    }
    
    return playerID;
}

    