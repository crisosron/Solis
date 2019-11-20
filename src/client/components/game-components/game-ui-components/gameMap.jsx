import React, { Component } from "react";
class GameMap extends Component {
  state = {
    containerRendered: false
  };
  
  componentDidMount(){

    // TODO: Yes this feels like an antipattern since it causes the entire component to be re-rendered after its been rendered
    // The whole point of this is to achieve the conditional rendering that happens in the render method
    // Perhaps all of this can be improved if the dimensions of the gameMapContainer can be passed down as props to this component
    // (therefore removing the need to re-render the component and the getting rid of the ugly code in the render method)
    this.setState({
      containerRendered: true
    });
  }

  handleGameMapClicked = () => {
    console.log("Game map clicked");
    const ctx = this.obtainCanvasContext();
    ctx.moveTo(0,0);
    ctx.lineTo(200, 200);
    ctx.stroke();
  };

  obtainCanvasContext = () => {
    const canvas = document.getElementById("gameMapCanvas");
    return canvas.getContext("2d");
  }

  render() {
    const style = { // Used only in the canvas container
      backgroundColor: "lightYellow",
      flex: "3"
    };

    // First render the container, then once the container has been rendered, determine dimensions of canvas and render canvas as well
    if(!this.state.containerRendered) return <div style={style} id="gameMapCanvasContainer"></div>

    // Obtaining the dimensions of the canvas (very important that the dimensions of the canvas are inserted using js (see props of canvas) instead of css)
    // to ensure that the elements rendered onto the canvas are as sharp as possible and are not affected by potential scaling issues
    const gameMapCanvasContainer = document.getElementById("gameMapCanvasContainer");
    const gameMapCanvasContainerCompStyles = window.getComputedStyle(gameMapCanvasContainer);
    const canvasWidth = gameMapCanvasContainerCompStyles.width;
    const canvasHeight = gameMapCanvasContainerCompStyles.height;
    return (
      <div style={style} id="gameMapCanvasContainer">
        <canvas ref="gameMapCanvas" id="gameMapCanvas" width={canvasWidth} height={canvasHeight} style={style} onClick={this.handleGameMapClicked}></canvas>
      </div>
    );
  }
}

export default GameMap;
