import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Solis from './client/components/solis.jsx'
import * as serviceWorker from './serviceWorker';
import openSocket from "socket.io-client";

// Creating the socket to connect the client to the server
const socket = openSocket(`http://localhost:8000`);
socket.on('welcome', () => {
    alert("Welcome To Solis?");
});
export default socket;

ReactDOM.render(<Solis />, document.getElementById('root'));
serviceWorker.unregister();