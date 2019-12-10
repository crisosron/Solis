import React, {Component} from 'react';
import './menuComponents.css';
import GAME_ROOM_EVENTS from '../../../gameRoomEvents';
import socket from '../../../index';
// export default class ColorOption extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             selected: this.props.selected,
//             classNames: "colorOption"
//         };
//     }

//     handleColorOptionClicked = () => {
//         if (this.state.selected) {
//             this.setState({
//                 classNames: "colorOption selectedColorOption"
//             });
//             return;
//         }

//         // Sending request to server that the color be associated with the selecting socket
//         socket.emit(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, {
//             gameID: this.props.gameID,
//             colorOption: this.props.colorValue
//         });

//     }
    
//     render(){
//         const style = {backgroundColor: this.props.colorValue}
//         return(<div className={this.state.classNames} id={this.props.colorValue} onClick={this.handleColorOptionClicked} style={style} />);
//     }
// }

export default function ColorOption(props){
    const handleColorOptionClicked = () => {
        if(props.selected) return

        // Sending request to server that the color be associated with the selecting socket
        socket.emit(GAME_ROOM_EVENTS.REQUESTS.SELECT_COLOR_OPTION, {
            gameID: props.gameID,
            colorOption: props.colorValue
        });
    }

    const style = {backgroundColor: props.colorValue}
    return(<div className={props.classes} id={props.colorValue} onClick={handleColorOptionClicked} style={style} />);
}