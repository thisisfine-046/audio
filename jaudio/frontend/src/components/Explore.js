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
import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import LoginPage from "./Login"

const code = new URLSearchParams(window.location.search).get("code")

  
export default class ExplorePage extends Component{
    constructor(props){
        super(props);
        this.SpotifyCode = this.props.match.params.SpotifyCode;

        
    }
    

    Dashboard(){
        fetch("/spotify/get-auth-url")
        .then((response) => response.json())
        .then((data) => {
            this.setState({ SpotifyCode: data.url });
            console.log(data.url);
        });
    }
    renderExplorePage(){
        return (
                <div>
                    <h1>SpotifyCode = {this.SpotifyCode}</h1>
                </div>
            
        );
    }
    render(){
        return this.renderExplorePage();
    }
}