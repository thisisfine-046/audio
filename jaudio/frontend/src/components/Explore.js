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
import NewReleases from "./NewReleases"
import Globaltop from "./Globaltop"
import TodayTop from "./TopToday"
import SpotifyPlayer from 'react-spotify-web-playback';

const code = new URLSearchParams(window.location.search).get("code")



export default class ExplorePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            newReleases: {},
            globalTop:{},
            todaytop:{},
        };
        this.SpotifyCode = this.props.match.params.SpotifyCode;
        this.getNewReleases = this.getNewReleases.bind(this);
        this.getNewReleases();
        this.getGlobalTop = this.getGlobalTop.bind(this);
        this.getGlobalTop();
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

    getNewReleases() {
        fetch("/spotify/new-release")
          .then((response) => {
            if (!response.ok) {
              return {};
            } else {
              return response.json();
            }
          })
          .then((data) => {
            this.setState({ newReleases: data });
            console.log(data);
          });
          this.authenticateSpotify();
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


    renderExplorePage(){
      const songs_uri = this.props.song_uri
      const access_token = this.props.access_token
        return (
            <div>
            <div class ="header-content">
                <h5>Discover new music every day</h5>
                <h3>Millions of songs and podcasts. No credit card needed.</h3>
            </div>    
            <div class="dash-title">
                <h2 class="Overview" >Today's Top Hit</h2>
                <a class="see-all" href="/today-top">See All</a>
            </div>

            <div class="dash-cards-title">
                <TodayTop {...this.state.todaytop.song1} />
                <TodayTop {...this.state.todaytop.song2} />
                <TodayTop {...this.state.todaytop.song3} />
            </div>

            <div class="dash-title">
                <h2 class="New-releases" >New Releases</h2>
                <a class="see-all" href="/new-release">See All</a>
            </div>
                
            <div class="dash-cards-small">
                <NewReleases {...this.state.newReleases.song1} />
                <NewReleases {...this.state.newReleases.song2} />
                <NewReleases {...this.state.newReleases.song3} />
                <NewReleases {...this.state.newReleases.song4} />
                <NewReleases {...this.state.newReleases.song5} />
                <NewReleases {...this.state.newReleases.song6} />
                <NewReleases {...this.state.newReleases.song7} />
            </div>

            <div class="dash-title">
                <h2 class="trending" >Top Global</h2>
                <a class="see-all" href="/global-top">See All</a>
            </div>

            <div class="dash-cards-small">
                <Globaltop {...this.state.globalTop.song1} />
                <Globaltop {...this.state.globalTop.song2} />
                <Globaltop {...this.state.globalTop.song3} />
                <Globaltop {...this.state.globalTop.song4} />
                <Globaltop {...this.state.globalTop.song5} />
                <Globaltop {...this.state.globalTop.song6} />
                <Globaltop {...this.state.globalTop.song7} />
            </div>

                <div class="dash-title">
                <h2 class="artists" >Artists</h2>
                <a class="see-all" href="">See All</a>
                </div>

                <div class="dash-cards-circle">
                    <div class="card-circle">
                        <div class="overlayer-circle">
                            <i class="material-icons">play_circle</i>      
                        </div>

                        <img src="data:image/jpeg;base64,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" alt=""/>
                    </div>

                    <div class="card-circle">
                        <div class="overlayer-circle">
                            <i class="material-icons">play_circle</i>
                        </div>

                        <img src="https://external-preview.redd.it/T-m8x-KlE9J5lz8-YJA-2OTZbqzj7NnRJh9dU2H17Pw.jpg?auto=webp&s=972eea88862419eb8f4dc1a03286c46cd4c5858a" alt=""/>
                    </div>

                    <div class="card-circle">
                        <div class="overlayer-circle">
                            <i class="material-icons">play_circle</i>
                        </div>

                        <img src="https://i.imgur.com/kthMk0T.jpg" alt=""/>
                    </div>

                    <div class="card-circle">
                        <div class="overlayer-circle">
                            <i class="material-icons">play_circle</i>
                        </div>

                        <img src="https://i.pinimg.com/originals/22/47/41/224741133cb7493c8f7b2f5a550e5028.jpg" alt=""/>
                    </div>

                    <div class="card-circle">
                        <div class="overlayer-circle">
                            <i class="material-icons">play_circle</i>
                        </div>
                        <img src="https://www.dhresource.com/0x0/f2/albu/g7/M01/F8/E4/rBVaSVvkMNeAdPQRAARy8yBI2OU451.jpg/cardi-b-invasion-of-privacy-album-cover-music.jpg" alt=""/>
                    </div>
                </div>

                <div class='extra'>
                </div>
                <div class='footer'>
                <SpotifyPlayer
                    token= {access_token}
                    uris={songs_uri ? [songs_uri] : []}
                    styles={{
                      bgColor: '#1f1f1f',
                      color: '#fff',
                      height:55,
                      play: true,
                      sliderColor: '#1cb954',
                      trackArtistColor: '#b3b3b3',
                      trackNameColor: '#fff',
                    }}
                  />;
                </div>  
        </div>
            
        );
    }
    render(){
        return this.renderExplorePage();
    }
}