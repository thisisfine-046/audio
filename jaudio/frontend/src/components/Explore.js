import React , { Component } from 'react';
import { 
    Button, 
    Grid, 
    ButtonGroup , 
    Typography
} from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

const code = new URLSearchParams(window.location.search).get("code")

  
export default class ExplorePage extends Component{
    constructor(props){
        super(props);
        
    }

    
    

    renderExplorePage(){
        return (
                <div>
                    {code}
                </div>
            
        );
    }

    render(){
        return this.renderExplorePage();
    }
}