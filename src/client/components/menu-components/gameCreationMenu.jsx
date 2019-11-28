import React, { Component } from "react";
import "./menuComponents.css";
import ColorOption from "./colorOption";
import UserName from "./userName";
import { Link } from "react-router-dom";
import CLIENT_REQUESTS from "../../../clientRequests";
import SERVER_RESPONSES from "../../../serverResponses";
import GAME_ROOM_EVENTS from "../../../gameRoomEvents";
import socket from "../../../index.js";

export default class GameCreationMenu extends Component {
  constructor(props) {
    super(props);
    this.ENTER_KEY = 13;
    this.userNameInputField = null;
    this.NUM_COLORS_AVAILABLE = 16;

    this.initServerResponseListening();

    this.state = {
      confirmPressed: false,
      currentUserName: "", // Displayed for 'this' client only
      connectedPlayersUserNames: [],
      colorOptions: this.generateRandomColors(),
      colorSelectionActive: false,
      creatorUserName: null
    };
  }

  initServerResponseListening(){
    
    // Handles the event fired from server that indicates that a player has joined this game room
    socket.on(GAME_ROOM_EVENTS.RESPONSES.PLAYER_JOINED, data => {
      let connectedPlayersUserNames = this.state.connectedPlayersUserNames;
      connectedPlayersUserNames.push(data.joinedPlayerUserName);
      this.setState({
        connectedPlayersUserNames: connectedPlayersUserNames
      });
    });


  }

  // Generates some random colors that will be available for selection when the component is about to mount.
  generateRandomColors = () => {
    // Populating a collection of randomly generated colors
    let randomlyGeneratedColors = [];
    for (let i = 0; i < this.NUM_COLORS_AVAILABLE; i++) {
      let randomColor = this.createRandomColor();

      // Check if random color is already in the array of randomly generated colors
      if (randomlyGeneratedColors.includes(randomColor)) {
        i--;
        continue;
      }

      randomlyGeneratedColors.push(randomColor);
    }

    return randomlyGeneratedColors;
  };

  // Creates and returns a single random color in hexadecimal form
  createRandomColor = () => {
    const characters = "0123456789ABCDEF";
    let randomColor = "#";
    for (let i = 0; i < 6; i++)
      randomColor += characters[Math.floor(Math.random() * characters.length)];
    return randomColor;
  };

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
    if (this.state.confirmPressed) return;
    if (!this.validUserName()) return;

    // Making input fields read only when settings have been confirmed
    document.getElementById("maxPlayersOptions").setAttribute("disabled", "");
    document.getElementById("startingResourcesInput").readOnly = true;
    document.getElementById("startingFleetSizeInput").readOnly = true;

    // When settings are confirmed, the game id needs to be created in the server, and the server will send
    // it back here so that it can be displayed in this component
    socket.emit(CLIENT_REQUESTS.CREATE_GAME_ID, {
      creatorUserName: this.userNameInputField.value
    });

    socket.on(SERVER_RESPONSES.GAME_ID_DELIVERY, data => {
      this.sendSettingsToServer(data.gameID);
      this.setState({
        confirmPressed: true,
        colorSelectionActive: true,
        gameID: data.gameID // TODO: GameID doesn't mutate throughout the life of this component. Maybe make it a field instead of encapsulating it within the state of the component?
      });
    });
  };

  sendSettingsToServer(gameID) {
    // Obtain selected settings options
    const maxPlayersSelectElem = document.getElementById("maxPlayersOptions");
    const startingResourcesInput = document.getElementById(
      "startingResourcesInput"
    );
    const startingFleetSizeInput = document.getElementById(
      "startingFleetSizeInput"
    );
    const maxPlayers =
      maxPlayersSelectElem.options[maxPlayersSelectElem.selectedIndex].value;
    const startingResources = startingResourcesInput.value;
    const startingFleetSize = startingFleetSizeInput.value;

    // Sends the selected settings options to the server
    socket.emit("store-game-attributes", {
      gameID: gameID,
      maxPlayers: maxPlayers,
      startingResources: startingResources,
      startingFleetSize: startingFleetSize,
      colorOptions: this.state.colorOptions
    });
  }

  render() {
    return (
      <div className="centerStyle">
        <h1 id="createGameTitle">Create Game</h1>
        <h3>Game ID</h3>
        <h2 className="backgroundHighlight">
          {this.state.confirmPressed
            ? this.state.gameID
            : "Confirm settings to generate game code"}
        </h2>
        <br />
        <input
          type="text"
          id="userNameInputField"
          placeholder="Enter username"
          maxLength="15"
        />
        <div className="centerStyle optionsDiv">
          <div id="attributeOptionsDiv">
            <h3>Settings</h3>
            <input
              type="text"
              className="optionsDivInputLabel"
              placeholder="Players connected: #/#"
              readOnly
            />
            <input
              type="text"
              className="optionsDivSmallInputLabel"
              placeholder="Max Players:"
              readOnly
            />

            <select id="maxPlayersOptions">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>

            <input
              type="text"
              className="optionsDivSmallInputLabel"
              placeholder="Starting Resources:"
              readOnly
            />

            <input
              type="number"
              id="startingResourcesInput"
              className="optionsDivSmallInput"
              placeholder="Enter Value"
              defaultValue="300"
              min="50"
              max="1000"
            />

            <input
              type="text"
              className="optionsDivSmallInputLabel"
              placeholder="Starting Fleet Size:"
              readOnly
            />

            <input
              type="number"
              id="startingFleetSizeInput"
              className="optionsDivSmallInput"
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

          {/*Subdivision of options div - Displays all available colors for the user to select from */}
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

          {/*Subdivision of options div - Displays all registered user names - Names are colored by the user's selection*/}
          <div id="registeredUsersDiv">
            <h3>Connected Players</h3>
            {this.state.connectedPlayersUserNames.length !== 0 &&
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

        {/*Buttons to navigate away from this component*/}
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
