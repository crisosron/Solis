import React, { Component } from "react";
import "./menu-components.css";
import { Link } from "react-router-dom";
export default class GameCreationMenu extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.userNameInputField = null;

    this.state = {
      confirmPressed: false,
      currentUserName: ""
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.registerUserName); // When the enter key is pressed, try to register the name
    this.userNameInputField = document.getElementById("userNameInputField");
    this.userNameInputField.addEventListener("blur", this.registerUserName); // When the input field is made out of focus, try to register name
  }

  registerUserName = e => {
    if (e instanceof KeyboardEvent && e.keyCode !== this.ENTER_KEY) return;
    if (this.validUserName()) {
      this.setState({
        currentUserName: document.getElementById("userNameInputField").value
      });
    }
  };

  // Checks the name entered into the username input field and determines its validity
  validUserName = () => {
    const enteredUserName = this.userNameInputField.value;
    if (enteredUserName === "") {
      this.userNameInputField.placeholder = "Please enter a username here!";
      return false;
    }
    return true;
  };

  handleConfirmSettingsPressed = () => {
    // First, check if the username is valid
    if (!this.validUserName()) return;
    const userNameInputField = document.getElementById("userNameInputField");
    userNameInputField.readOnly = true; // Disables the user name input field

    this.setState({
      confirmPressed: true
    });

    // TODO: Handle confirmation of settings through the server. Init the game to use the specified settings
    // TODO: Once confirm is pressed, the game code should be activated
  };

  render() {
    return (
      <div className="centerStyle">
        <h1 id="createGameTitle">Create Game</h1>
        <h3>Game Code</h3>
        <input
          type="text"
          placeholder={"Some random code" /*TODO: Develop this*/}
          className="inputLabelHighlighted"
          readOnly
        />
        <br />
        {/*TODO: When this is out of focus, or if enter is pressed, register the current username */}
        <input
          type="text"
          id="userNameInputField"
          placeholder={"Enter username"}
          maxLength="15"
        />{" "}
        <div className="centerStyle optionsDiv">
          <div id="attributeOptionsDiv">
            <input
              type="text"
              className="attributeOptionsDivInputLabel"
              placeholder="Players connected: #/#"
              readOnly
            />
            <input
              type="text"
              className="attributeOptionsDivInputLabel"
              placeholder={"Username: " + this.state.currentUserName}
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
              id="confirmSettingsButton"
              className={
                this.state.confirmPressed ? "disabledButton" : "generalButton"
              }
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
          <button className="affirmativeButton">Play</button>
        </Link>
      </div>
    );
  }
}
