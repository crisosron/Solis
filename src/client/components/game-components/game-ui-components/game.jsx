import React, { Component } from "react";
import MainContainer from "./mainContainer";
import SideBar from "./sideBar";
import socket from "../../../../index";
import GAME_EVENTS from "../../../../gameEvents";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      initialGameSettings: this.props.location.state.gameAttributes
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
    console.log(this.state.initialGameSettings);
    const style = {
      fontFamily: "Arial",
      width: window.innerWidth,
      height: window.innerHeight,
      display: "flex"
    };

    return (
      <div style={style}>
        <MainContainer />
        <SideBar />
      </div>
    );
  }
}

export default Game;
