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
        <table id="outerTable">
          <tr>
            <th>Resources</th>
            <th>Property</th>
            <th>Fleets</th>
          </tr>
          <tr>

            {/* Resources sub table */}
            <td>
              <table class="childTable">
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
            </td>

            {/* Property sub table */}
            <td>
              <table class="childTable">
                <tr>
                  <td>Nodes Owned:</td>
                  <td>Value</td>
                </tr>

                <tr>
                  <td>T1 colonies:</td>
                  <td>Value</td>
                </tr>
                
                <tr>
                  <td>T2 colonies:</td>
                  <td>Value</td>
                </tr>

                <tr>
                  <td>T3 colonies:</td>
                  <td>Value</td>
                </tr>
              </table>
            </td>

            {/* Fleets sub table */}
            <td>
              <table class="childTable">
                  <tr>
                    <td>Fleets:</td>
                    <td>Value</td>
                  </tr>

                  <tr>
                    <td>Total Size:</td>
                    <td>Value</td>
                  </tr>
                  
                </table>
            </td>

          </tr>
        </table>
      </div>
    );
  }
}

export default PlayerInfo;
