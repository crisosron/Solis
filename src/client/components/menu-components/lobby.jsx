import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserName from "./userName";
import ColorOption from "./colorOption";
import socket from "../../../index.js";
import "./menuComponents.css"

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    let gameID = null;
    console.log(this.props.match);
    this.state = {
      colorOptions: [],
      connectedPlayersUserNames: []
    };
  }

  componentDidMount() {}

  render() {
    console.log("About to render lobby");
    return (
      <div className="centerStyle">
        <h1 className="title">Lobby</h1>
        <h3>Game Code</h3>
        <h2>{this.props.match.params.id}</h2>

        <div className="centerStyle optionsDiv">

          <div id="colorSelectorDiv">
            <h3>Select A Color</h3>
          </div>

          <div id="connectedPlayersDiv">
            <h3>Connected Players</h3>
          </div>

        </div>

        <br />
        <br />
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
