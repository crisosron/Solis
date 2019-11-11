import React, { Component } from "react";
import RoundDiceIndicator from "./roundDiceIndicator";
import NodeInfo from "./nodeInfo";
import OtherPlayerInfo from "./otherPlayerInfo";
import ChatWindow from "./chatWindow";
import BuyMenu from "./buyMenu";

class SideBar extends Component {
  state = {};
  render() {
    const style = {
      backgroundColor: "salmon",
      flex: "1"
    };
    return <div style={style}></div>;
  }
}

export default SideBar;
