import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./menuComponents.css";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import socket from "../../../index.js";

export default class JoinGameMenu extends Component {
  constructor(props) {
    super(props);
    socket.on("invalid-game-id-entered", data => {
      // TODO: Do something fancier, instead of just an alert
      alert("Invalid Game-ID: ", data.message);
      document.getElementById("gameIDInputField").value = "";
    });

    this.state = {
      joinGameActive: false
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", e => {
      if (e.keyCode === 13 && this.validInputs()) {
        this.setState({
          joinGameActive: true
        });
      }
    });

    //TODO: Can be made cleaner by placing if statement in common function
    document
      .getElementById("userNameInputField")
      .addEventListener("blur", () => {
        if (this.validInputs()) {
          this.setState({
            joinGameActive: true
          });
        }
      });

    document.getElementById("gameIDInputField").addEventListener("blur", () => {
      if (this.validInputs()) {
        this.setState({
          joinGameActive: true
        });
      }
    });
  }

  validInputs = () => {
    const userNameInputField = document.getElementById("userNameInputField");
    const gameIDInputField = document.getElementById("gameIDInputField");

    // Checking precondition that the user has entered a username
    if (
      userNameInputField.value === "" ||
      userNameInputField.value == null ||
      gameIDInputField.value === "" ||
      gameIDInputField.value == null
    ) {
      userNameInputField.placeholder = "Please enter your username here!";
      gameIDInputField.placeholder = "Please enter game id here!";
      return false;
    }

    return true;
  };

  handleJoinGameClicked = () => {
    socket.emit(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, {
      gameID: document.getElementById("gameIDInputField").value,
      userName: document.getElementById("userNameInputField").value
    });
  };

  render() {
	
	// Ensures that the rendered button only has the wrapping Link react-router element when the button becomes active
	// (activation of button depends on valdity of input fields)
    const joinGameButton = (<button className={this.state.joinGameActive ? "generalButton" : "disabledButton"}>Join Game</button>);
    let joinGameButtonRender = joinGameButton;
    if (this.state.joinGameActive)
      joinGameButtonRender = <Link to="/">{joinGameButton}</Link>;

    return (
      <div className="centerStyle">
        <h1>Join Game</h1>
        <input type="text" id="gameIDInputField" placeholder="Enter game ID" />
        <br />
        <input
          type="text"
          id="userNameInputField"
          placeholder="Enter username"
        />
        <br />
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>

		{/*Will either render with or without the wrapping link element*/}
        {joinGameButtonRender}
      </div>
    );
  }
}
