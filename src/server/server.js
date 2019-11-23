const io = require('socket.io')();
const PORT_NUM = 8000;
let numClientsConnected = 0;

io.listen(PORT_NUM);
console.log("Listening for connections on port ", PORT_NUM);
io.on('connection', (client) => {
    console.log("Client has connected");
    numClientsConnected++;
    console.log('Number of clients connected so far: ', numClientsConnected);

    io.on('disconnect', () => {
        console.log('Client disconnected');
        numClientsConnected--;
    });
});

    