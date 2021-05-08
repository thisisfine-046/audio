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

import NewReleases from "./NewReleases"
  
export default class LibraryPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            newReleases: {},
        };
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getNewReleases = this.getNewReleases.bind(this);
        this.getNewReleases();
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
    }
    

    renderLibraryPage(){
        return (
            <div>
                <div class ="header-content">
                    <h5>Your Playlist</h5>
                </div>

                <div class="dash-title1">
                    <h2 class="Overview" href="" >Playlist</h2>
                    <h2 class="Overview"  href="" >Artists</h2>
                    <h2 class="Overview" href="" >Album</h2>
                </div>

                <div>
                  <div class="dash-cards-small">
                    <NewReleases {...this.state.newReleases.song1} />
                    <NewReleases {...this.state.newReleases.song2} />
                    <NewReleases {...this.state.newReleases.song3} />
                    <NewReleases {...this.state.newReleases.song4} />
                    <NewReleases {...this.state.newReleases.song5} />
                    <NewReleases {...this.state.newReleases.song6} />
                    <NewReleases {...this.state.newReleases.song7} />
                  </div>
                </div>
                
                <footer>
                </footer>
            </div>
            
        );
    }

    render(){
        return this.renderLibraryPage();
    }
}