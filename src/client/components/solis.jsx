import React, { Component } from "react";
import GameMap from "./gameMap";
import PlayerInfo from "./playerInfo";
import SideBar from "./sideBar";

class Solis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  }

  // When the component mounts onto the real DOM, update the window dimensions
  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  };

  // Updates the dimensions of the window - Used for resizability purposes
  updateWindowDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  render() {
    const style = {
      fontFamily: "Arial",
      width: window.innerWidth,
      height: window.innerHeight
    };

    return (
      <div style={style}>
        <GameMap />
        <PlayerInfo />
        <SideBar />
      </div>
    );
  }
}

export default Solis;
