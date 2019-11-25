import React from 'react';

export default function PlayerName(){
    const style = {
        color: this.props.playerColor
    }
    return(
        <h1 style={style}>this.props.playerName</h1>
    );
}
