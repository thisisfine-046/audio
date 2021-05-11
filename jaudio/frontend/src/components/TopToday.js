import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SpotifyWebApi from "spotify-web-api-js";
import SpotifyPlayer from 'react-spotify-web-playback';

const spotify = new SpotifyWebApi();


function myFunction() {
  var x = document.getElementById('footer');
  if (x.style.display === "none") {
    x.style.display = "block";
  }
}



export default class TodayTop extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const songs_uri = this.props.song_uri
    const access_token = this.props.access_token
    return (
      <div>

          <div class="card-title">
                    <div class="overlayer">
                        <i class="material-icons" onclick="myFunction()">play_circle</i>
                        <i class="material-icons">favorite</i>
                    </div>

                    <div class="card">
                        <img src={this.props.images} alt=""/>
                        <span class="content" title={this.props.song_name}>{this.props.song_name}</span>
                        <h4 title={this.props.artist_name}>{this.props.artist_name}</h4>
                    </div>
                    
            </div>
      </div>
    );
  }
}