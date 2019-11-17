import React, { Component } from "react";

// Child component of SideBar
export default class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ENTER_KEY = 13;
  }

  componentDidMount() {
    
    // Adds a key listener for the chatting purposes
    document.addEventListener("keydown", this.sendMessage);
  }

  sendMessage = event => {
    const inputField = document.getElementById("chatInput");

    // First determine if the input field is focused, then determine if its an empty string, then determine if key pressed is Enter
    if (document.activeElement === inputField && inputField.value !== "" &&this.ENTER_KEY === event.keyCode){

      //TODO: Send messages to server then process such that all clients will see the message onto their chatWindow
      console.log("Send message ", inputField.value);

      // Clears the input field
      inputField.value = "";
    }
    //TODO: Implement spam timer?
  };

  render() {
    const chatDisplayStyles = {
      padding: "5px",
      flex: "5"
    };

    const chatInputStyles = {
      backgroundColor: "#121212",
      color: "white",
      paddingLeft: "3px",
      flex: "1"
    };

    // TODO: Insert messages inside chatDisplay div
    return (
      <React.Fragment>
        <div id="chatDisplay" style={chatDisplayStyles} />
        <input type="text" id="chatInput" style={chatInputStyles} />
      </React.Fragment>
    );
  }
}
