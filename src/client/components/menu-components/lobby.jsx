import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import socket from "../../../index.js";

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    let gameID = null;
    this.state = {
      colorOptions: [],
      connectedPlayersUserNames: []
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="centerStyle optionsDiv" id="lobby">
        <h1>Lobby</h1>
        <h2>GameID goes here</h2>
        <div className="centerStyle optionsDiv">
          {/*Color selection rendering*/}
          <div id="colorSelectorDiv">
            <h3>Color Selection</h3>
            <div id="colorSelectorDivOptions">
              {this.state.colorSelectionActive && // Only render color options if settings have been confirmed
                this.state.colorOptions.map(colorOption => {
                  return (
                    <ColorOption
                      colorValue={colorOption}
                      key={colorOption}
                      id={`ColorOption ${colorOption}`}
                    />
                  );
                })}
            </div>
          </div>

          <div id="connectedPlayersDiv">
            <h3>Connected Players</h3>
            {this.state.connectedPlayersUserNames.length !== 0 && // cond && statement makes it so that the map array function only executes if there are connected users at all!
              this.state.connectedPlayersUserNames.map(playerUserName => {
                return (
                  <UserName
                    playerName={playerUserName}
                    playerColor="#ffffff"
                    key={playerUserName + " #ffffff"}
                    thisPlayer={this}
                  />
                );
              })}
          </div>
        </div>
        <Link>
          <button className="returnButton">Return</button>
        </Link>
        <Link>
          <button className="affirmativeButton">Play</button>
        </Link>
      </div>
    );
  }
}
