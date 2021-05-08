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
const spotify = new SpotifyWebApi();



export default class NewReleases extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {

    return (
      <div>
          
          <div class="card-single" >
            <div class="overlayer-single">
				      <i 
                class="material-icons"
              >
                play_circle</i>
              <i class="material-icons">favorite</i>  
			      </div>

             <div class="card-small">
              <img src={this.props.images} alt=""/>
              <span class="content" data-tooltip={this.props.song_name} >{this.props.song_name}</span>
              <h5 data-tooltip="{this.props.artist_name}" >{this.props.artist_name}</h5>
            </div>    
          </div>

          
      </div>
    );
  }
}