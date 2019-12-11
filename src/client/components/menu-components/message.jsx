import React from 'react';

export default function Message(props){
    const style={
        color: props.senderColor
    }
    return <p style={style}><strong>{props.senderUsername}:</strong> {props.message}</p>;
}