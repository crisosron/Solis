import React, { Component } from "react";
import "./menuComponents.css";
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

    this.state = {
      confirmPressed: false,
      currentUserName: "", // Displayed for 'this' client only
      createGameButtonActive: false
    };
  }

  componentDidMount() {
    this.userNameInputField = document.getElementById("userNameInputField");
    this.userNameInputField.addEventListener("blur", this.validUserName); // When the input field is made out of focus, try to register name
    this.userNameInputField.addEventListener("keydown", this.validUserName);
  }

  // Checks the name entered into the username input field and determines its validity
  validUserName = () => {
    const enteredUserName = this.userNameInputField.value;
    if (enteredUserName === "") this.userNameInputField.placeholder = "Please enter a username here!";
    else this.setState({createGameButtonActive: true});
  };

  sendSettingsToServer(gameID) {
    if(!this.state.createGameButtonActive) return;

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

  render() {
    let createGameButton = null;

    // Conditionally rendering a Link element that wraps around the create game button depending if the button is active or not
    // 'active' nature of the create game button depends solely on whether or not there is text inside this.userNameInputField
    if(this.state.createGameButtonActive)
      createGameButton = <Link to="/lobby"><button className="affirmativeButton" onClick={this.sendSettingsToServer}>Create Game</button></Link>
    else createGameButton = <button className="disabledButton">Create Game</button>
    
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
        {createGameButton}
      </div>
    );
  }
}
