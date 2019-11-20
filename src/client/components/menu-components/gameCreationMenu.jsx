import React, { Component } from "react";
import "./menu-components.css";
import { Link } from "react-router-dom";
export default class GameCreationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConfirmSettingsPressed = () => {
    // TODO: Should add the className "disabledButton" to confirm button
    // TODO: Handle confirmation of settings through the server. Init the game to use the specified settings
  };

  render() {
    return (
      <div className="centerStyle">
        <h1 id="createGameTitle">Create Game</h1>
        <h3>Game Code</h3>
        <input
          type="text"
          placeholder={"Some random code" /*TODO: Develop this*/}
          className="inputPermanentFocus"
          readOnly
        />
        <br />
        {/*TODO: When this is out of focus, or if enter is pressed, register the current username */}
        <input type="text" placeholder={"Enter username"} maxLength="15" />{" "}
        <div className="centerStyle optionsDiv">
          <div id="attributeOptionsDiv">
            <input
              type="text"
              className="attributeOptionsDivInputLabel"
              placeholder="# of Players connected: #/tot"
              readOnly
            />
            <input
              type="text"
              className="attributeOptionsDivInputLabel"
              placeholder="Username: username"
              readOnly
            />

            <input
              type="text"
              className="attributeOptionsDivSmallInputLabel"
              placeholder="Max Players:"
              readOnly
            />

            <select>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>

            <input
              type="text"
              className="attributeOptionsDivSmallInputLabel"
              placeholder="Starting Resources:"
              readOnly
            />

            <input
              type="number"
              id="startingResourcesInput"
              className="attributeOptionsDivSmallInput"
              placeholder="Enter Value"
              defaultValue="300"
              min="50"
              max="1000"
            />

            <input
              type="text"
              className="attributeOptionsDivSmallInputLabel"
              placeholder="Starting Fleet Size:"
              readOnly
            />

            <input
              type="number"
              id="startingResourcesInput"
              className="attributeOptionsDivSmallInput"
              placeholder="Enter Value"
              defaultValue="10"
              min="0"
              max="500"
            />

            <button
              className="confirmSettingsButton"
              onClick={this.handleConfirmSettingsPressed}
            >
              Confirm Settings
            </button>
          </div>
          <div id="colorSelectorDiv"></div>
        </div>
        <Link to="/">
          <button className="returnButton">Return</button>
        </Link>
        <Link to="/game">
          <button className="createGameButton">Play</button>
        </Link>
      </div>
    );
  }
}
