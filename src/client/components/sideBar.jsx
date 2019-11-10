import React, { Component } from "react";
class SideBar extends Component {
  state = {};
  render() {
    const style = {
      backgroundColor: "salmon",
      width: "30%",
      height: "107.5%",
      margin: "-60% 0 0 70%"
    };
    return <div style={style}></div>;
  }
}

export default SideBar;
