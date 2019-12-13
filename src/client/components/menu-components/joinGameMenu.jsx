import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./menuComponents.css";
import SERVER_RESPONSES from "../../../serverResponses";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import socket from "../../../index.js";
import EXCEPTIONS from "../../../server/exceptions"

export default class JoinGameMenu extends Component {
  constructor(props) {
    super(props);
    this.initServerResponseListening();
    this.state = {
      joinGameActive: false,
      redirectToGame: false,
      targetGameRoomColorOptions: null,
      targetGameRoomUserNameColorMap: null,
      targetGameRoomMessages: null
    };
  }

  initServerResponseListening(){

    // Handling event when the request to join the game room has been accepted
    socket.on(SERVER_RESPONSES.JOIN_GAME_REQUEST_ACCEPTED, data => {
      this.setState({
        redirectToGame: true, 
        targetGameRoomColorOptions: data.colorOptions, 
        targetGameRoomUserNameColorMap: data.userNameColorMap,
        targetGameRoomMessages: data.messages
      });
    });

    // TODO: Do something fancier, instead of just an alert
    // TODO: Might be a good idea to also pass in an error enum to tell us what kind of error occured. That way, we can handle them in different ways
    socket.on(SERVER_RESPONSES.JOIN_GAME_REQUEST_REJECTED, data => {
      alert(`${data.message}`);
      if(data.exception === EXCEPTIONS.INVALID_GAME_ID || data.exception === EXCEPTIONS.MAX_PLAYERS_REACHED) document.getElementById("gameIDInputField").value = "";
      else document.getElementById("userNameInputField").value = "";
      this.setState({joinGameActive: false});
    });
  }

  componentDidMount() {
    let userNameInputField = document.getElementById("userNameInputField");
    let gameIDInputField= document.getElementById("gameIDInputField");

    userNameInputField.addEventListener("keydown", this.areInputsValid);
    gameIDInputField.addEventListener("keydown", this.areInputsValid);

  }

  areInputsValid = () => {
    let userNameInputField = document.getElementById("userNameInputField");
    let gameIDInputField= document.getElementById("gameIDInputField");
    if(userNameInputField.value !== "" && gameIDInputField.value !== ""){
      this.setState({
        joinGameActive: true
      });  
    }
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
    if(this.state.redirectToGame) return <Redirect push to={{
      pathname: `/lobby/${document.getElementById("gameIDInputField").value}`,
      state: {
        colorOptions: this.state.targetGameRoomColorOptions,
        userNameColorMap: this.state.targetGameRoomUserNameColorMap,
        messages: this.state.targetGameRoomMessages
      }
    }} />

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
