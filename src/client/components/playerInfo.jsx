import React, { Component } from "react";
class PlayerInfo extends Component {
  state = {};
  render() {
    const style = {
      backgroundColor: "teal",
      flex: "1"
    };
    return (
      <div style={style}>
        <h1>PlayerInfo</h1>
      </div>
    );
  }
}

export default PlayerInfo;
