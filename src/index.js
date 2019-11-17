import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Solis from './client/components/solis.jsx'
import SolisLobby from './client/components/lobby-components/solisLobby'
import * as serviceWorker from './serviceWorker';

// TODO: Need a way of setting this to true when all players that are connected are ready to start playing
const renderGame = false;

//Rendering base Solis component
if(renderGame) {
    ReactDOM.render( < Solis / > , document.getElementById('root'))
}else ReactDOM.render(< SolisLobby />, document.getElementById('root'))

serviceWorker.unregister();