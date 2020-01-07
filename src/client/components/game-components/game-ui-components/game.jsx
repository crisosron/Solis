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

      /*Note: Structure of thisPlayerInfo: (Can be found at getAllInfo method @ player.js)
        thisPlayerInfo{
          allInfo{
            color: val
            userName: val
            resources: {
              minerals: val
              manpower: val
              darkMatter: val
              alloys: val
              fuelCells: val
            }
          }
        }
      */
      thisPlayerInfo: this.props.location.state.thisPlayerInfo,

      //Note: Strucutre of otherPlayerInfo is the same thisPlayerInfo, but is an array of these
      otherPlayersInfo: this.props.location.state.otherPlayersInfo
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
