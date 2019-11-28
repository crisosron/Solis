import React from 'react';

export default function UserName(props){
    const style = {
        marginTop: "0px",
        color: props.playerColor,
        fontSize: "18px",
    }
    return(
        <h1 style={style}>{props.playerName}</h1>
    );
}
