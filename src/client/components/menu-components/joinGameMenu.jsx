import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./menuComponents.css";

export default class JoinGameMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleJoinGameClicked = () => {
    //TODO: Handle join game pressed - Determine if game code entered is correct
  };

  render() {
    return (
      <div className="centerStyle">
        <h1>Join Game</h1>
        <input type="text" placeholder="Enter game code" />
        <br />
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>

        <Link to="/">
          {/*TODO: Should link to the createGame page associated with the game code entered if the game code is valid*/}
          <button className="generalButton">Join Game</button>
        </Link>
      </div>
    );
  }
}
