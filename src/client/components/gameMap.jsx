import React, { Component } from "react";
class GameMap extends Component {
  state = {};

  componentDidMount() {
    const canvas = this.refs.gameMapCanvas;
    const canvasContext = canvas.getContext("2d");
    //const gameMapCanvas = document.getElementById("gameMapCanvas");
    //console.log(gameMapCanvas);
    this.drawNode(canvasContext);
  }

  handleGameMapClicked = () => {
    console.log("Game map clicked");
  };

  // TODO: Temporary
  drawNode = canvasContext => {
    canvasContext.beginPath();
    canvasContext.arc(100, 100, 3, 0, Math.PI * 2);
    canvasContext.fillStyle = "blue";
    canvasContext.fill();
  };

  render() {
    //const parentComponent = gameMap.parentNode();
    //const computedStyles = window.getComputedStyle(gameMapCanvas);
    //console.log(computedStyles);
    const style = {
      backgroundColor: "lightYellow",
      flex: "3"
    };
    return (
      <canvas ref="gameMapCanvas" id="gameMapCanvas" style={style}></canvas>
    );
  }
}

export default GameMap;
