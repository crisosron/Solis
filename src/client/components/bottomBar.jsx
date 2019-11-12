import React, { Component } from "react";
import OtherPlayerInfo from "./otherPlayerInfo";
import PlayerInfo from "./playerInfo";
class BottomBar extends Component {
  state = {};
  render() {
    const style = {
      backgroundColor: "lightGreen",
      display: "flex",
      flex: "1"
    };

    return (
      <div style={style}>
        <PlayerInfo />
        <OtherPlayerInfo />
      </div>
    );
  }
}

export default BottomBar;
