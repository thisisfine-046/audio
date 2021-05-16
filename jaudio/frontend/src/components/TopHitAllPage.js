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
import TopHitAll from "./TopHitAll"
import SpotifyPlayer from 'react-spotify-web-playback';

const code = new URLSearchParams(window.location.search).get("code")



export default class TopHitAllPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            todaytop:{},
        };
        this.SpotifyCode = this.props.match.params.SpotifyCode;
        this.getTodayTop = this.getTodayTop.bind(this);
        this.getTodayTop();


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

      getTodayTop() {
        fetch("/spotify/today-top")
          .then((response) => {
            if (!response.ok) {
              return {};
            } else {
              return response.json();
            }
          })
          .then((data) => {
            this.setState({ todaytop: data });
            console.log(data);
          });
          this.authenticateSpotify();
    }



    renderGlobalTopAllPage(){
        return (
          <div>
            <div class ="header-content">
                <h5>TODAY'S TOP HIT</h5>
            </div>  

            <div class="list-view">
              <div class="list-title">
                  <h3 class="number" >#</h3>
                  <h3  class="song">SONG NAME</h3>
                  <h3  class="album">ALBUM</h3>
                  <h3 class="artist">ARTIST</h3>
                  <h3 class ="time">TIME</h3>
              </div>
                <TopHitAll {...this.state.todaytop.song1} />
                <TopHitAll {...this.state.todaytop.song2} />
                <TopHitAll {...this.state.todaytop.song3} />
                <TopHitAll {...this.state.todaytop.song4} />
                <TopHitAll {...this.state.todaytop.song5} />
                <TopHitAll {...this.state.todaytop.song6} />
                <TopHitAll {...this.state.todaytop.song7} />
                <TopHitAll {...this.state.todaytop.song8} />
                <TopHitAll {...this.state.todaytop.song9} />
                <TopHitAll {...this.state.todaytop.song10} />
                <TopHitAll {...this.state.todaytop.song11} />
                <TopHitAll {...this.state.todaytop.song12} />
                <TopHitAll {...this.state.todaytop.song13} />
                <TopHitAll {...this.state.todaytop.song14} />
                <TopHitAll {...this.state.todaytop.song15} />
                <TopHitAll {...this.state.todaytop.song16} />
                <TopHitAll {...this.state.todaytop.song17} />
                <TopHitAll {...this.state.todaytop.song18} />
                <TopHitAll {...this.state.todaytop.song19} />
                <TopHitAll {...this.state.todaytop.song20} />
                
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