import React from "react";
import Game from "./game-components/game-ui-components/game";
import SolisLobby from "./menu-components/solisLobby";
import GameCreationMenu from "./menu-components/gameCreationMenu";
import JoinGameMenu from "./menu-components/joinGameMenu";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function Solis() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={SolisLobby} />
          <Route path="/game" component={Game} />
          <Route path="/create-game-menu" component={GameCreationMenu} />
          <Route path="/join-game-menu" component={JoinGameMenu} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default Solis;
