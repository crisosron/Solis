import React, { Component } from "react";
import RoundDiceIndicator from "./roundDiceIndicator";
import NodeInfo from "./nodeInfo";
import ChatWindow from "./chatWindow";
import BuyMenu from "./buyMenu";
import "./sideBarChildComponents.css";

class SideBar extends Component {
  state = {};
  render() {
    const style = {
      backgroundColor: "black",
      display: "flex",
      flexDirection: "column",
      flex: "1"
    };
    return (
      <div style={style}>
        <div className="subComponentSmaller subComponentCommon">
          {/*Components are enclosed in divs so that the positioning is loosely coupled with the component */}
          <RoundDiceIndicator />
        </div>
        <div className="subComponentRegular subComponentCommon subComponentFlex">
          <ChatWindow />
        </div>
        <div className="subComponentRegular subComponentCommon">
          <BuyMenu />
        </div>
        <div className="subComponentRegular subComponentCommon">
          <NodeInfo />
        </div>
      </div>
    );
  }
}

export default SideBar;
