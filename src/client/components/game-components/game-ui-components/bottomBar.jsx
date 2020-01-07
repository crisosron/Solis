import React, { Component } from "react";
import OtherPlayerInfo from "./otherPlayerInfo";
import PlayerInfo from "./playerInfo";
import "./bottomBarStyle.css"
class BottomBar extends Component {
  state = {};
  render() {
    return (
      <div id="bottomBar">
        <PlayerInfo playerInfo={this.props.thisPlayerInfo}/>
        <OtherPlayerInfo otherPlayersInfo={this.props.otherPlayersInfo}/>
      </div>
    );
  }
}

export default BottomBar;
