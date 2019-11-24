import React, {Component} from 'react';
import './menuComponents.css';
export default class ColorOption extends Component{
    constructor(props){
        super(props);
        this.state = {
            selected: false,
            classNames: "colorOption"
        };
    }

    handleColorOptionClicked = () => {
        if (this.state.selected) return;
        this.setState({
            selected: true,
            classNames: "colorOption selectedColorOption"
        });
    }
    
    render(){
        const style = {backgroundColor: this.props.colorValue}
        return(<div className={this.state.classNames} id={this.props.colorValue} onClick={this.handleColorOptionClicked} style={style} />);
    }
}