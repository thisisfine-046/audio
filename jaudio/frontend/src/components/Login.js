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
            <div>
                <div class="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>

                        <span>Sign up with your email address</span>
                        <div class="social-container">
                        <a href="https://www.spotify.com/us/signup/" class="spotify"><i class="fab fa-spotify"></i></a>
                        <a href="https://soundcloud.com/signin" class="soundcloud"><i class="fab fa-soundcloud"></i></a>
                        <a href="https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp" class="youtube"><i class="fab fa-youtube"></i></a>
                        </div>
                        <span>We may use your email and devices for updates and tips on SoundCloud's, Spotify's and YouTube's products and services, and for activities notifications. You can unsubscribe for free at any time in your notification settings.</span>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <span>Log in with your email address</span>
                        <div class="social-container">
                        <button  onClick={() => this.toGetSpotifyAuth()} class="spotify"><i class="fab fa-spotify"></i></button>
                        <button href="#" class="soundcloud"><i class="fab fa-soundcloud"></i></button>
                        <button href="#" class="youtube"><i class="fab fa-youtube"></i></button>
                        </div>
                        <span>We may use your email and devices for updates and tips on SoundCloud's, Spotify's and YouTube's products and services, and for activities notifications. You can unsubscribe for free at any time in your notification settings.</span>
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
