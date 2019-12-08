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
      connectedPlayersUserNames: this.props.location.state.connectedPlayersUserNames
    };
  }

  initServerListening(){
    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, data => {
      let newConnectedPlayersUserNames = this.state.connectedPlayersUserNames.concat(data.joinedPlayerUserName);
      this.setState({
        connectedPlayersUserNames: newConnectedPlayersUserNames
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
              return <ColorOption colorValue={colorOption} key={colorOption} id={`ColorOption: ${colorOption}`} />
            })}
          </div>
          
          {/*Rendering of connected players user names*/}
          <div id="connectedPlayersDiv">
            <h3>Connected Players</h3>
            {this.state.connectedPlayersUserNames.map(userName => {
              return <UserName playerName={userName} playerColor="#ffffff" key={userName + " #ffffff"}/>
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
