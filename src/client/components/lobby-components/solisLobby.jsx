import React, { Component } from "react";
import "./lobby.css";
import {Link} from 'react-router-dom';

export default class SolisLobby extends Component {

  // Enum that represents the game creation status
  GameCreationStatus = {
    NONE: 0,
    CREATE_GAME: 1,
    JOIN_GAME: 2
  };

  constructor(props) {
    super(props);
    this.state = {
      gameCreationStatus: this.GameCreationStatus.NONE // Game creation status is part of the state since the player can change between creating and joining a game
    };
  }

  handleCreateGamePressed = () => {
    console.log("Create game pressed");
    this.setState({
      gameCreationStatus: this.GameCreationStatus.CREATE_GAME
    });

    // TODO: Do server processing
  };

  handleJoinGamePressed = () => {
    console.log("Join game pressed");
    this.setState({
      gameCreationStatus: this.GameCreationStatus.JOIN_GAME
    });

    // TODO: Do server processing
  };

  render() {
    return (
      <div className="solisLobby">
        <h1>Solis Lobby</h1>

        {/*Uses Link from react-router-dom to make this button link to a route so that the component associated with the route can be rendered*/}
        <Link to="/createGameMenu">
          <button className="createGameButton" onClick={this.handleCreateGamePressed}> Create Game </button>
        </Link>

        <Link to="joinGameMenu">
          <button className="joinGameButton" onClick={this.handleJoinGamePressed}> Join Game </button>
        </Link>
      </div>
    );
  }
}