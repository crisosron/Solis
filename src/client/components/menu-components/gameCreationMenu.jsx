import React, { Component } from "react";
import "./menuComponents.css";
import "./inputs.css";
import "./buttons.css"
import { Link, Redirect } from "react-router-dom";
import CLIENT_REQUESTS from "../../../clientRequests";
import SERVER_RESPONSES from "../../../serverResponses";
import socket from "../../../index.js";

export default class GameCreationMenu extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.userNameInputField = null;
    this.initServerListening();

    this.state = {
      confirmPressed: false,
      createGameButtonActive: false,
      redirectToLobby: false,
      gameID: null,
      userNameColorMap: null
    };
  }

  initServerListening(){
    socket.on(SERVER_RESPONSES.STORE_GAME_ATTRIBUTES_ACCEPTED, data => {
      this.setState({
        gameID: data.gameID,
        colorOptions: data.colorOptions,
        userNameColorMap: data.userNameColorMap,
        messages: data.messages,
        redirectToLobby: true
      });
    });
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

  requestGameCreation = () => {
    if(!this.state.createGameButtonActive) return;

    // Obtaining selected options and inputs from input fields
    const maxPlayersInput = document.getElementById("maxPlayersInputField");
    const startingResourcesInput = document.getElementById(
      "startingResourcesInputField"
    );
    const startingFleetSizeInput = document.getElementById(
      "startingFleetSizeInputField"
    );
    const maxPlayers = maxPlayersInput.value;
    const startingResources = startingResourcesInput.value;
    const startingFleetSize = startingFleetSizeInput.value;

    // Sends the selected settings options to the server
    socket.emit(CLIENT_REQUESTS.CREATE_GAME, {
      creatorUserName: this.userNameInputField.value,
      maxPlayers: maxPlayers,
      startingResources: startingResources,
      startingFleetSize: startingFleetSize
    });
  }

  render() {
    // Redirects to lobby when the game attributes have been stored by the server (see initServerListening)
    if(this.state.redirectToLobby) return <Redirect push to={{
      pathname: `/lobby/${this.state.gameID}`,
      state: {
        colorOptions: this.state.colorOptions,
        userNameColorMap: this.state.userNameColorMap,
        messages: this.state.messages,
        totalNumPlayers: 1,
        numPlayersReady: 0,
        maxPlayers: document.getElementById("maxPlayersInputField").value
      }
    }} />
    
    return(
      <div className="centerStyle">
        <h1 className="title">Create Game</h1>

        <h3>Username</h3>
        <input type="text" id="userNameInputField" className="quarterInput" placeholder="Enter your username" maxLength="15"/>

        <h3>Maximum Number of Players</h3>
        <input type="number" id="maxPlayersInputField" className="quarterInput" placeholder="Enter maximum number of players" defaultValue="2" min="2" max="6" />

        <h3>Starting Resources Amount</h3>
        <input type="number" id="startingResourcesInputField" className="quarterInput" placeholder="Enter Value" defaultValue="300" min="50" max="1000"/>

        <h3>Starting Fleet Size</h3>
        <input type="number" id="startingFleetSizeInputField" className="quarterInput" placeholder="Enter Value" defaultValue="10" min="0" max="500"/>
        <br/>
        <br/>

        {/*Buttons to navigate away from this component*/}
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>
        
        <button className={this.state.createGameButtonActive ? "affirmativeButton" : "disabledButton"} onClick={this.requestGameCreation}>Create Game</button>

      </div>
    );
  }
}
