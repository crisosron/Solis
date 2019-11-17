import React, { Component } from "react";
import "./lobby.css";
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

    //TODO: In render, render the pop up for creating a game (on top of the existing page)
  };

  handleJoinGamePressed = () => {
    console.log("Join game pressed");
    this.setState({
      gameCreationStatus: this.GameCreationStatus.JOIN_GAME
    });

    //TODO: In render, render the pop up for joining a game (on top of the existing page)
  };

  render() {
    return (
      <div className="solisLobby">
        <h1>Solis Lobby</h1>
        <button
          className="createGameButton"
          onClick={this.handleCreateGamePressed}
        >
          Create Game
        </button>
        <button className="joinGameButton" onClick={this.handleJoinGamePressed}>
          Join Game
        </button>
      </div>
    );
  }
}
