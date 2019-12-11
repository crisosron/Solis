import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import Message from "./message"
import socket from "../../../index.js";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import "./menuComponents.css"
import "./inputs.css"

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.initServerListening();
    this.state = {
      colorOptions: this.props.location.state.colorOptions, // Note that colorOptions is already a map. It contains elements -> {color: "some color", selected: false}
      userNameColorMap: this.props.location.state.userNameColorMap,
      messages: []
    };
  }

  initServerListening(){
    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, data => {
      let newUserNameColorMap = this.state.userNameColorMap.concat(data.joiningPlayerUserNameColorMap);
      this.setState({
        userNameColorMap: newUserNameColorMap
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.COLOR_OPTION_SELECTED, data => {

      // Shallow copy okay here since the mapping objects are only used for their values and not their identity
      let newUserNameColorMap = [...this.state.userNameColorMap];
      let newColorOptions = [...this.state.colorOptions];

      for(let i = 0; i < newColorOptions.length; i++){
        let colorOption = newColorOptions[i]
        if(colorOption.color === data.color)colorOption.selected = true
      }

      for(let i = 0; i < newUserNameColorMap.length; i++){
        let mapping = newUserNameColorMap[i];
        if(mapping.userName === data.userName) mapping.color = data.color;
      }

      this.setState({
        colorOptions: newColorOptions,
        userNameColorMap: newUserNameColorMap
      });
    });

    socket.on(GAME_ROOM_EVENTS.RESPONSES.DISPLAY_MESSAGE, data => {
      this.addMessage(data.senderUserName, data.senderColor, data.message);
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

  addMessage = (senderUsername, senderColor, message) => {
    let messagesCopy = [...this.state.messages];

    messagesCopy.push({
      senderUsername: senderUsername,
      senderColor: senderColor,
      message: message
    });

    this.setState({
      messages: messagesCopy
    });

    // TODO: Should there be a limit placed on the number of messages that is stored on the client side?
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
            {this.state.userNameColorMap.map(mapping => {
              return <UserName playerName={mapping.userName} playerColor={mapping.color} key={mapping.userName + " " + mapping.color}/>
            })}
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
                key={message.sender + ":" + message.senderColor + ":" + message.message}
                />
              })}
            </div>
            <input type="text" className="chatInput" placeholder="Type here" id="lobbyChatInputField"/>
          </div>

        </div>

        <br />
        <br />
        
        <Link to="/gameCreationMenu">
          <button className="returnButton">Return</button>
        </Link>
        <Link to="/game">
          <button className="affirmativeButton">Play</button>
        </Link>
      </div>
    );
  }
}
