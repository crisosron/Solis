import React, { Component } from "react";
import "./menuComponents.css";
import "./gameCreationMenu.css";
import "./inputs.css";
import { Link } from "react-router-dom";
import CLIENT_REQUESTS from "../../../clientRequests";
import SERVER_RESPONSES from "../../../serverResponses";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import socket from "../../../index.js";

export default class GameCreationMenu extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.userNameInputField = null;

    this.initServerResponseListening();

    this.state = {
      confirmPressed: false,
      currentUserName: "", // Displayed for 'this' client only
      connectedPlayersUserNames: [],
      colorOptions: null, // Set to an array with request SERVER_RESPONSES.GAME_ID_DELIVERY
      colorSelectionActive: false,
      creatorUserName: null
    };
  }

  initServerResponseListening() {
    // Handles the event fired from server that indicates that a player has joined this game room
    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, data => {
      let connectedPlayersUserNames = this.state.connectedPlayersUserNames;
      connectedPlayersUserNames.push(data.joinedPlayerUserName);
      this.setState({
        connectedPlayersUserNames: connectedPlayersUserNames
      });

      // If it's not the game creator joining the game room to trigger this entire block, send updates to the server
      if (connectedPlayersUserNames.length !== 1) this.sendUpdateToServer();
    });
  }

  componentDidMount() {
    // document.addEventListener("keydown", this.registerUserName); // When the enter key is pressed, try to register the name
    // this.userNameInputField = document.getElementById("userNameInputField");
    // this.userNameInputField.addEventListener("blur", this.registerUserName); // When the input field is made out of focus, try to register name
  }

  registerUserName = e => {
    if (e instanceof KeyboardEvent && e.keyCode !== this.ENTER_KEY) return;
    if (this.validUserName()) {
      this.setState({
        currentUserName: document.getElementById("userNameInputField").value
      });
    }
  };

  // Checks the name entered into the username input field and determines its validity
  validUserName = () => {
    const enteredUserName = this.userNameInputField.value;
    if (enteredUserName === "") {
      this.userNameInputField.placeholder = "Please enter a username here!";
      return false;
    }
    return true;
  };

  handleConfirmSettingsPressed = () => {
    if (this.state.confirmPressed) return;
    if (!this.validUserName()) return;

    // Making input fields read only when settings have been confirmed
    document.getElementById("maxPlayersOptions").setAttribute("disabled", "");
    document.getElementById("startingResourcesInput").readOnly = true;
    document.getElementById("startingFleetSizeInput").readOnly = true;

    // When settings are confirmed, the game id needs to be created in the server, and the server will send
    // it back here so that it can be displayed in this component
    socket.emit(CLIENT_REQUESTS.CREATE_GAME_ID, {
      creatorUserName: this.userNameInputField.value
    });

    socket.on(SERVER_RESPONSES.GAME_ID_DELIVERY, data => {
      this.sendSettingsToServer(data.gameID);
      this.setState({
        confirmPressed: true,
        colorSelectionActive: true,
        gameID: data.gameID, // TODO: GameID doesn't mutate throughout the life of this component. Maybe make it a field instead of encapsulating it within the state of the component?
        colorOptions: data.colorOptions
      });
    });
  };

  sendSettingsToServer(gameID) {
    // Obtain selected settings options
    const maxPlayersSelectElem = document.getElementById("maxPlayersOptions");
    const startingResourcesInput = document.getElementById(
      "startingResourcesInput"
    );
    const startingFleetSizeInput = document.getElementById(
      "startingFleetSizeInput"
    );
    const maxPlayers =
      maxPlayersSelectElem.options[maxPlayersSelectElem.selectedIndex].value;
    const startingResources = startingResourcesInput.value;
    const startingFleetSize = startingFleetSizeInput.value;

    // Sends the selected settings options to the server
    socket.emit(CLIENT_REQUESTS.STORE_GAME_ATTRIBUTES, {
      gameID: gameID,
      maxPlayers: maxPlayers,
      startingResources: startingResources,
      startingFleetSize: startingFleetSize
    });
  }

  // This method should be called whenever updates to the state needs to be sent to all subscribers of the game room
  sendUpdateToServer() {
    socket.emit(GAME_ROOM_EVENTS.REQUESTS.UPDATE_STATE, {
      newState: this.state
    });
  }

  render() {
    return(
      <div className="centerStyle">
        <h1 className="title">Create Game</h1>

        <h3>Username</h3>
        <input type="text" id="userNameInputField" className="quarterInput" placeholder="Enter your username" maxLength="15"/>

        <h3>Maximum Number of Players</h3>
        <input type="number" id="maxPlayersInputField" className="quarterInput" placeholder="Enter maximum number of players" defaultValue="2" min="2" max="6" />

        <h3>Starting Resources Amount</h3>
        <input type="number" id="startingResourcesInput" className="quarterInput" placeholder="Enter Value" defaultValue="300" min="50" max="1000"/>

        <h3>Starting Fleet Size</h3>
        <input type="number" id="startingFleetSizeInput" className="quarterInput" placeholder="Enter Value" defaultValue="10" min="0" max="500"/>
        <br/>
        <br/>
        
        {/*Buttons to navigate away from this component*/}
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>
        <Link to="/lobby">
          <button className="affirmativeButton">Create Game</button>
        </Link>
      </div>
    );
  }
}
