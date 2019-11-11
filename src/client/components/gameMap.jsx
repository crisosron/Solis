import React, { Component } from "react";
class GameMap extends Component {
  state = {};
  handleGameMapClicked = () => {
    console.log("Game map clicked");
  };
  render() {
    const style = {
      backgroundColor: "lightYellow",
      flex: "3"
    };
    return <div style={style} onClick={this.handleGameMapClicked}></div>;
  }
}

export default GameMap;
