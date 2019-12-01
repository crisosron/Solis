import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./menuComponents.css";
import SERVER_RESPONSES from "../../../serverResponses";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import socket from "../../../index.js";

export default class JoinGameMenu extends Component {
  constructor(props) {
    super(props);
    this.initServerResponseListening();
    this.state = {
      joinGameActive: false,
      redirectToGame: false
    };
  }

  initServerResponseListening(){

    // Handling event when the request to join the game room has been accepted
    socket.on(SERVER_RESPONSES.JOIN_GAME_REQUEST_ACCEPTED, () => {
      console.log("Join game request has been accepted");
      this.setState({redirectToGame: true});
    });

    // TODO: Do something fancier, instead of just an alert
    // Listening for event when entered game id is not found by the server
    socket.on(SERVER_RESPONSES.INVALID_GAME_ID_ENTERED, data => {
      alert("Invalid Game-ID: ", data.message);
      document.getElementById("gameIDInputField").value = "";
      this.setState({joinGameActive: false});
    });

    // Listening for event when the entered username is already in use by a player in the game room being joined
    socket.on(SERVER_RESPONSES.DUPLICATE_USER_NAME, data => {
      alert("Duplicate Username ", data.message);
      document.getElementById("userNameInputField").value = "";
      this.setState({joinGameActive: false})
    });

  }

  componentDidMount() {
    document.addEventListener("keydown", e => {
      if (e.keyCode === 13 && this.areInputsValid()) {
        this.setState({
          joinGameActive: true
        });
      }
    });

    //TODO: Can be made cleaner by placing if statement in common function
    document
      .getElementById("userNameInputField")
      .addEventListener("blur", () => {
        if (this.areInputsValid()) {
          this.setState({
            joinGameActive: true
          });
        }
      });

    document.getElementById("gameIDInputField").addEventListener("blur", () => {
      if (this.areInputsValid()) {
        this.setState({
          joinGameActive: true
        });
      }
    });
  }

  areInputsValid = () => {
    const userNameInputField = document.getElementById("userNameInputField");
    const gameIDInputField = document.getElementById("gameIDInputField");

    if (
      // Checking precondition that the user has entered a username
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
    if(!this.state.joinGameActive) return;

    socket.emit(GAME_ROOM_EVENTS.REQUESTS.JOIN_GAME_ROOM, {
      gameID: document.getElementById("gameIDInputField").value,
      userName: document.getElementById("userNameInputField").value
    });
  };

  render() {
    // If condition is true, instead of rendering this component, redirect to the desired component 
    // (Note, this is a better solution than wrapping the join game button in a Link element since 
    //    1. Less LOC and more intuitive code wise
    //    2. Makes the error alert messages render on this component. Previously, the alert would appear on the linked page
    //      since clicking the join game button would instantly link to the desired component before the alert could be processed)
    if(this.state.redirectToGame) return <Redirect push to="/" />

    return (
      <div className="centerStyle">
        <h1>Join Game</h1>
        <input type="text" id="gameIDInputField" placeholder="Enter game ID"/>
        <br />
        <input
          type="text"
          id="userNameInputField"
          placeholder="Enter username"
          maxLength="15"
        />
        <br />
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>

        <button className={this.state.joinGameActive ? "generalButton" : "disabledButton"} onClick={this.handleJoinGameClicked}>Join Game</button>

      </div>
    );
  }
}
