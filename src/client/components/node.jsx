import React, {Component} from 'react';

class Node extends Component {
    constructor(props){
        super(props);
        this.state = {
            pos: {x:generateX(), y:generateY()}
        }
    }
    render() { 
        return (  );
    }
    
    generateX = () => {
        //TODO: Develop this
    }

    generateY = () => {
        //TODO: Develop this
    }
}
 
export default Node;