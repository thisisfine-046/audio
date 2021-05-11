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

import SpotifyPlayer from 'react-spotify-web-playback';


export default class Player extends Component {
  constructor(props) {
    super(props);
  }

  Player(access, uri ){
    return(
        <SpotifyPlayer
            token= {access}
            uris={uri ? [uri] : []}
        />
    );
  }

  render() {
    const songs_uri = this.props.song_uri
    const access_token = this.props.access_token
    return (
        <Card>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={this.props.images} height="100%" width="100%" />
          </Grid>

          <Grid item align="center" xs={8}>

            <Typography component="h5" variant="h5">
              {this.props.song_name}
            </Typography>

            <Typography color="textSecondary" variant="subtitle1">
              {this.props.artist_name}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {access_token}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {songs_uri}
            </Typography>
                <SpotifyPlayer
                    token= {access_token}
                    uris={songs_uri}
                />
          </Grid>
        </Grid>
      </Card>
    );
  }
}