import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import socket from "../../../index.js";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import "./menuComponents.css"

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.initServerListening();
    this.state = {
      colorOptions: this.props.location.state.colorOptions,
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
      let newUserNameColorMap = [...this.state.userNameColorMap]; // Shallow copy okay here since the mapping objects are only used for their values and not their identity

      for(let i = 0; i < newUserNameColorMap.length; i++){
        let mapping = newUserNameColorMap[i];
        if(mapping.userName === data.userName) mapping.color = data.color;
      }

      this.setState({
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
              return <ColorOption colorValue={colorOption} key={colorOption} id={`ColorOption: ${colorOption}`} gameID={this.props.match.params.id} />
            })}
          </div>
          
          {/*Rendering of connected players user names*/}
          <div id="connectedPlayersDiv">
            <h3>Connected Players</h3>
            {this.state.userNameColorMap.map(mapping => {
              return <UserName playerName={mapping.userName} playerColor={mapping.color} key={mapping.userName + " " + mapping.color}/>
            })}
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
