import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./menuComponents.css";
import socket from '../../../index.js';

export default class JoinGameMenu extends Component {
  constructor(props) {
    super(props);
    socket.on('invalid-game-id-entered', (data) => {

      // TODO: Do something fancier, instead of just an alert
      alert("Invalid Game-ID: ", data.message);
    });

    this.state = {
    };
  }

  handleJoinGameClicked = () => {
    socket.emit('join-game-room', {gameID: document.getElementById("gameIDInput").value});
  };

  render() {
    return (
      <div className="centerStyle">
        <h1>Join Game</h1>
        <input type="text" id="gameIDInput" placeholder="Enter game ID" />
        <br />
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>

        <Link to="/">
          {/*TODO: Should link to the createGame page associated with the game code entered if the game code is valid*/}
          <button className="generalButton" onClick={this.handleJoinGameClicked}>Join Game</button>
        </Link>
      </div>
    );
  }
}
