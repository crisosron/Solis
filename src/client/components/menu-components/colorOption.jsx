import React, {Component} from 'react';
import './menuComponents.css';
import GAME_ROOM_EVENTS from '../../../gameRoomEvents';
import socket from '../../../index';
export default class ColorOption extends Component{
    constructor(props){
        super(props);
        this.state = {
            selected: this.props.selected,
        };
    }

    handleColorOptionClicked = () => {
        if (this.state.selected) return;

        // Sending request to server that the color be associated with the selecting socket
        socket.emit(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, {
            gameID: this.props.gameID,
            colorOption: this.props.colorValue
        });
    }
    
    render(){
        const style = {backgroundColor: this.props.colorValue}
        return(<div className={"colorOption"} id={this.props.colorValue} onClick={this.handleColorOptionClicked} style={style} />);
    }
}