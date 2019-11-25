import React from 'react';

export default function UserName(props){
    const style = {
        color: props.playerColor
    }
    console.log(props.playerName);
    return(
    <h1 style={style}>{props.playerName}</h1>
    );
}
