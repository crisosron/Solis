import React, { Component } from "react";
import "./menuComponents.css";
import { Link } from "react-router-dom";
import socket from "../../../index.js";

//TODO: Rename to SolisHome
// TODO: Make this into a functional stateless component
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
    this.setState({
      gameCreationStatus: this.GameCreationStatus.CREATE_GAME
    });
  };

  handleJoinGamePressed = () => {
    console.log("Join game pressed");
    this.setState({
      gameCreationStatus: this.GameCreationStatus.JOIN_GAME
    });
  };

  render() {
    return (
      <div className="centerStyle">
        <h1>Solis</h1>

        {/*Uses Link from react-router-dom to make this button link to a route so that the component associated with the route can be rendered*/}
        <Link to="/create-game-menu">
          <button
            className="affirmativeButton"
            onClick={this.handleCreateGamePressed}
          >
            {" "}
            Create Game{" "}
          </button>
        </Link>

        <Link to="/join-game-menu">
          <button
            className="generalButton"
            onClick={this.handleJoinGamePressed}
          >
            Join Game
          </button>
        </Link>
      </div>
    );
  }
}
