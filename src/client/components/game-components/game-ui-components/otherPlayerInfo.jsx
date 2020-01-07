import React, { Component } from "react";

// Child component of BottomBar
class OtherPlayerInfo extends Component {
  state = {};
  render() {
    const style = {
      borderRight: "none"
    }
    return (
      <div style={style}>
        <h1>OtherPlayerInfo</h1>
      </div>
    );
  }
}

export default OtherPlayerInfo;
