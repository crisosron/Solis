import React, { Component } from "react";

// Node components are rendered onto this component
class GameMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: []
    };
  }

  handleGameMapClicked = () => {
    //TODO: Handle node clicking, then update NodeInfo component with node information
    console.log("Gamemap clicked");
  };

  render() {
    const style = {
      backgroundColor: "lightBlue",
      width: "70%",
      height: "80%"
    };
    return <div style={style} onClick={this.handleGameMapClicked}></div>;
  }
}

export default GameMap;
