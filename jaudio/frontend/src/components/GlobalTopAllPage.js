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
import GlobalTopAll from "./GlobalTopAll"
import Globaltop from "./Globaltop"
import SpotifyPlayer from 'react-spotify-web-playback';

const code = new URLSearchParams(window.location.search).get("code")



export default class GlobalTopAllPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            globalTop:{},
        };
        this.SpotifyCode = this.props.match.params.SpotifyCode;
        this.getGlobalTop = this.getGlobalTop.bind(this);
        this.getGlobalTop();


    }
    
    

    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
          .then((response) => response.json())
          .then((data) => {
            this.setState({ spotifyAuthenticated: data.status });
            console.log(data.status);
            if (!data.status) {
              fetch("/spotify/get-auth-url")
                .then((response) => response.json())
                .then((data) => {
                  window.location.replace(data.url);
                });
            }
          });
      }

    getGlobalTop() {
        fetch("/spotify/global-top")
          .then((response) => {
            if (!response.ok) {
              return {};
            } else {
              return response.json();
            }
          })
          .then((data) => {
            this.setState({ globalTop: data });
            console.log(data);
          });
          this.authenticateSpotify();
    }



    renderGlobalTopAllPage(){
        return (
          <div>
            <div class ="header-content">
                <h5>TOP GLOBAL</h5>
            </div>  

            <div class="list-view">
              <div class="list-title">
                  <h3 class="number" >#</h3>
                  <h3  class="song">SONG NAME</h3>
                  <h3  class="album">ALBUM</h3>
                  <h3 class="artist">ARTIST</h3>
                  <h3 class ="time">TIME</h3>
              </div>
                <GlobalTopAll {...this.state.globalTop.song1} />
                <GlobalTopAll {...this.state.globalTop.song2} />
                <GlobalTopAll {...this.state.globalTop.song3} />
                <GlobalTopAll {...this.state.globalTop.song4} />
                <GlobalTopAll {...this.state.globalTop.song5} />
                <GlobalTopAll {...this.state.globalTop.song6} />
                <GlobalTopAll {...this.state.globalTop.song7} />
                <GlobalTopAll {...this.state.globalTop.song8} />
                <GlobalTopAll {...this.state.globalTop.song9} />
                <GlobalTopAll {...this.state.globalTop.song10} />
                <GlobalTopAll {...this.state.globalTop.song11} />
                <GlobalTopAll {...this.state.globalTop.song12} />
                <GlobalTopAll {...this.state.globalTop.song13} />
                <GlobalTopAll {...this.state.globalTop.song14} />
                <GlobalTopAll {...this.state.globalTop.song15} />
                <GlobalTopAll {...this.state.globalTop.song16} />
                <GlobalTopAll {...this.state.globalTop.song17} />
                <GlobalTopAll {...this.state.globalTop.song18} />
                <GlobalTopAll {...this.state.globalTop.song19} />
                <GlobalTopAll {...this.state.globalTop.song20} />
            </div>

            <div class='extra'>
            </div>

        </div>
            
        );
    }
    render(){
        return this.renderGlobalTopAllPage();
    }
}