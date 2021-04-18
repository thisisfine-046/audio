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
        this.state = {
            spotifyCode : {}
        };
        
    }

    toGetSpotifyAuth() {
        fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    spotifyCode: data.url,
                });
                window.location.replace(data.url);
        });
    }

    

    renderSpotifyLoginButton(){
        return (
            <div class="container" id="container">
        
            <div class="form-container sign-up-container">
                <form action="#">
                    <h1>Create Account</h1>
                    <button>Sign Up</button>
                </form>
            </div>

            <div class="form-container sign-in-container">
                <form action="#">
                    <h1>Sign in</h1>

                    <button 
                    onClick={() => this.toGetSpotifyAuth()}>
                        Sign In
                        
                    </button>
                </form>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button class="ghost" id="signIn" >Sign In</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button class="ghost" id="signUp">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    render(){
        return this.renderSpotifyLoginButton();
    }
}
window.onload=function(){
	const signUpButton = document.getElementById('signUp');
	const signInButton = document.getElementById('signIn');
	const container = document.getElementById('container');
	
	
	signInButton.addEventListener('click', () => {
		container.classList.remove("right-panel-active");
	});
    signUpButton.addEventListener('click', () => {
		container.classList.add("right-panel-active");
	});s
}