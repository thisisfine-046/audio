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


  
export default class LoginPage extends Component{
    constructor(props){
        super(props);
        
    }

    renderSpotifyLoginButton(){
        return (
            <h1>j login di</h1>
        );
    }

    render(){
        return this.renderSpotifyLoginButton();
    }
}