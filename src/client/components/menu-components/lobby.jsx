import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import Message from "./message"
import socket from "../../../index.js";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import CLIENT_REQUESTS from "../../../clientRequests";
import SERVER_RESPONSES from "../../../serverResponses";
import "./menuComponents.css"
import "./buttons.css"
import "./inputs.css"

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.initServerListening();
    socket.emit(CLIENT_REQUESTS.GET_CREATOR_SOCKET_ID, {
      gameID: this.props.match.params.id
    });

    this.state = {
      colorOptions: this.props.location.state.colorOptions, // Note that colorOptions is already a map. It contains elements -> {color: "some color", selected: false}
      userNameColorMap: this.props.location.state.userNameColorMap,
      messages: this.props.location.state.messages,
      totalNumPlayers: this.props.location.state.totalNumPlayers, // Used to activate the ready button (there must be at least 2 players in the game!)
      numPlayersReady: this.props.location.state.numPlayersReady,
      hasClientSelectedColor: false,
      allPlayersReady: false,
      readyPressed: false,
    };
  }

  initServerListening(){
    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, data => {
      this.setState({
        userNameColorMap: data.userNameColorMap,
        totalNumPlayers: data.totalNumPlayers,
        allPlayersReady: false
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.COLOR_OPTION_SELECTED, data => {
      this.setState({
        colorOptions: data.updatedColorOptions,
        userNameColorMap: data.updatedUserNameColorMap
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.SET_CLIENT_HAS_SELECTED_COLOR, () => {
      this.setState({
        hasClientSelectedColor: true
      });
    })

    socket.on(GAME_ROOM_EVENTS.RESPONSES.DISPLAY_MESSAGE, data => {
      this.setState({
        messages: data.messages
      });

      // Sets the scrollbar to the bottom everytime a message is displayed
      let chatOutputDiv = document.getElementById("lobbyChatOutput");
      chatOutputDiv.scrollTop = chatOutputDiv.scrollHeight;
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.READY_UP_CONFIRMED, data => {
      this.setState({
        allPlayersReady: data.allPlayersReady,
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.UPDATE_READY_COUNT, data => {
      this.setState({
        numPlayersReady: data.numPlayersReady
      });
    });

    socket.on(SERVER_RESPONSES.CREATOR_SOCKET_ID_DELIVERY, data => {
      this.setState({
        renderPlayButton: data.creatorSocketID === socket.id
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_LEFT, data => {
      console.log("In Lobby component handling of PLAYER_LEFT");
      console.log(data);
      this.setState({
        userNameColorMap: data.userNameColorMap,
        totalNumPlayers: data.totalNumPlayers,
        numPlayersReady: data.numPlayersReady
      });
    });


  }
  
  componentDidMount(){
    const lobbyChatInputField = document.getElementById("lobbyChatInputField");
    lobbyChatInputField.addEventListener("keydown", e => {
      if(e.keyCode === this.ENTER_KEY){

        // Making sure that an empty message is not sent
        if(lobbyChatInputField.value === "") return;

        // Sending request to send the message to all clients in the game room
        socket.emit(GAME_ROOM_EVENTS.REQUESTS.SEND_MESSAGE, {
          message: lobbyChatInputField.value,
          gameID: this.props.match.params.id
        });

        // Clearing chat input field
        lobbyChatInputField.value = "";
      }
    });
  }

  componentWillUnmount(){
    // Handle the client leaving the lobby
    socket.emit(GAME_ROOM_EVENTS.REQUESTS.LEAVE_GAME_ROOM, {
      gameID: this.props.match.params.id,
    });
  }

  handleReadyPressed = () => {
    if(this.state.readyPressed || this.state.totalNumPlayers < 2 || !this.state.hasClientSelectedColor) return;
    socket.emit(GAME_ROOM_EVENTS.REQUESTS.READY_UP, {
      gameID: this.props.match.params.id
    });

    this.setState({
      readyPressed: true
    });
  }

  render() {
    return (
      <div className="centerStyle">
        <h1 className="title">Lobby</h1>
        <h3>Game Code</h3>
        <h2>{this.props.match.params.id}</h2>

        <div className="centerStyle optionsDiv">

          {/*Rendering of color options*/}
          <div id="colorSelectorDiv">
            <h3>Select A Color</h3>
            
            {this.state.colorOptions.map(colorOption => {  
              return <ColorOption 
              colorValue={colorOption.color}
              key={colorOption.color}
              id={`ColorOption: ${colorOption.color}`}
              gameID={this.props.match.params.id}
              selected={colorOption.selected}
              classes = {colorOption.selected ? "colorOption selectedColorOption" : "colorOption"}
              />
            })}
          </div>
          
          {/*Rendering of connected players user names*/}
          <div id="connectedPlayersDiv">
            <h3>Connected Players</h3>
              <div id="renderedUserNamesDiv">
                {this.state.userNameColorMap.map(mapping => {
                  return <UserName playerName={mapping.userName} playerColor={mapping.color} key={mapping.userName + " " + mapping.color}/>
                })}
              
              </div>
              <button id="readyButton" className={this.state.readyPressed || this.state.totalNumPlayers < 2 || !this.state.hasClientSelectedColor ? "disabledButton" : "generalButton"} onClick={this.handleReadyPressed}>Ready</button>

          </div>

          {/* Rendering the chat window for this Lobby */}
          <div id="lobbyChatWindow">
            <h3>Chat</h3>
            <div id="lobbyChatOutput">
              {this.state.messages.map(message => {
                return <Message 
                senderUsername={message.senderUsername} 
                senderColor={message.senderColor} 
                message={message.message}
                key={message.sender + ":" + message.senderColor + ":" + message.message} //TODO: Need a better ID
                />
              })}
            </div>
            <input type="text" className="chatInput" placeholder="Type here" id="lobbyChatInputField"/>
          </div>
        </div>

        <h3>Number of players ready: {this.state.numPlayersReady + "/" + this.state.totalNumPlayers}</h3>

        <br />
        <br />
        
        <Link to="/gameCreationMenu">
          <button className="returnButton">Return</button>
        </Link>
        
        { this.state.renderPlayButton && // Only renders the play button if this client is the creator
          <Link to="/game">
            <button className={this.state.allPlayersReady ? "affirmativeButton" : "disabledButton"}>Play</button>
          </Link>
        }

        <h3 id="numPlayersConnectedIndicator">Number of players connected: {this.state.totalNumPlayers + "/" + this.props.location.state.maxPlayers}</h3>

      </div>
    );
  }
}
