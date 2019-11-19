import React from 'react';
import Game from './game';
import SolisLobby from './lobby-components/solisLobby';
import GameCreationMenu from './lobby-components/gameCreationMenu';
import JoinGameMenu from './lobby-components/joinGameMenu';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function Solis(){
  return(
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={SolisLobby}/>
          <Route path="/game" component={Game} />
          <Route path="/createGameMenu" component={GameCreationMenu} />
          <Route path="/joinGameMenu" component={JoinGameMenu} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default Solis;
