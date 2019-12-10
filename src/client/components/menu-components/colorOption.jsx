import React, {Component} from 'react';
import './menuComponents.css';
import GAME_ROOM_EVENTS from '../../../gameRoomEvents';
import socket from '../../../index';

export default function ColorOption(props){
    const handleColorOptionClicked = () => {
        if(props.selected) return

        // Sending request to server that the color be associated with the selecting socket
        socket.emit(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, {
            gameID: props.gameID,
            selectedColor: props.colorValue
        });
    }

    const style = {backgroundColor: props.colorValue}
    return(<div className={props.classes} id={props.colorValue} onClick={handleColorOptionClicked} style={style} />);
}