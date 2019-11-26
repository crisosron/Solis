import React from 'react';

export default function UserName(props){
    const style = {
        color: props.playerColor,
        fontSize: "23px"
    }
    return(
        <h1 style={style}>{props.playerName}</h1>
    );
}
