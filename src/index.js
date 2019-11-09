import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Solis from './client/components/solis.jsx'
import * as serviceWorker from './serviceWorker';


//Rendering base Solis component
ReactDOM.render( < Solis / > , document.getElementById('root'));
serviceWorker.unregister();