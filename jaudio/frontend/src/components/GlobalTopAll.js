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


export default class GlobalTopAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSong: 10,
    };
    this.thisSet();
  }
  
  thisSet(value){
    this.setState({
      timeSong:value
    });
  }

  render() {
    var format = require('format-duration')
    const duration = this.props.song_duration
    var myInt = parseInt(duration)
    var time = format(myInt)

    const hours = (this.props.song_duration / 60000);
    return (
      <div>
        <div class="list-item">
          <div class="list-view-number">
            <button class='fas fa-play'></button>
          </div>
          <div class="list-view-img">
            <img src={this.props.images}/>
          </div>
          <div class="list-view-song">
            <span>{this.props.song_name}</span>
          </div>
          <div class="list-view-album">
            <span>{this.props.album_name}</span>
          </div>
          <div class="list-view-artist">
            <span>{this.props.artist_name}</span>
          </div>
          <div class="list-view-duration">
            <span>
              {time}
            </span>
          </div>
        </div>
      </div>

    );
  }
}