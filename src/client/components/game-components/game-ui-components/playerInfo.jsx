import React, { Component } from "react";
 /*Note: Structure of thisPlayerInfo prop: (Can be found at getAllInfo method @ player.js)
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
class PlayerInfo extends Component {
  render() {
    return (
      <div>
        <h1>PlayerInfo</h1>
        <h3>Resources</h3>
        <table>
          <tr>
            <td>Minerals:</td>
            <td>Value</td>
          </tr>

          <tr>
            <td>Manpower</td>
            <td>Value</td>
          </tr>

          <tr>
            <td>Dark Matter</td>
            <td>Value</td>
          </tr>

          <tr>
            <td>Alloys</td>            
            <td>Value</td>
          </tr>

          <tr>
            <td>Fuel Cells</td>            
            <td>Value</td>
          </tr>

        </table>
      </div>
    );
  }
}

export default PlayerInfo;
