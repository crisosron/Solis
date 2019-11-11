import React, { Component } from "react";
import GameMap from "./gameMap";
import PlayerInfo from "./playerInfo";

// Node components are rendered onto this component
class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: []
    };
  }

  render() {
    const style = {
      backgroundColor: "lightBlue",
      display: "flex",
      flexDirection: "column",
      flex: "2.5"
    };
    return (
      <div style={style}>
        <GameMap />
        <PlayerInfo />
      </div>
    );
  }
}

export default MainContainer;
