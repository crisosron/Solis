import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import socket from "../../../index.js";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import "./menuComponents.css"
import "./inputs.css"

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.initServerListening();
    this.state = {
      colorOptions: this.props.location.state.colorOptions, // Note that colorOptions is already a map. It contains elements -> {color: "some color", selected: false}
      userNameColorMap: this.props.location.state.userNameColorMap,
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
              <p>Test: test</p>
            </div>
            <input type="text" className="chatInput" placeholder="Type here" id="lobbyChatInput"/>
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
