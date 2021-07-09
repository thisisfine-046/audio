import React , { Component } from 'react';

import { 
    Button, 
    Grid, 
    Typography
} from '@material-ui/core';

import CreateRoomPage from './CreateRoomPage'
import MusicPlayer from "./MusicPlayer";
import { withStyles } from "@material-ui/core/styles";
export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);    
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getRoomDetails();
    this.getCurrentSong = this.getCurrentSong.bind(this);
    
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/roompage");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost){
          this.authenticateSpotify();
        }
      });
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

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        console.log(data);
      });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }



  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails()}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (

        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>

    );
  }

  renderRoomDetail(){
    if (this.state.showSettings){
      return this.renderSettings();
    }
    const WhiteTextTypography = withStyles({
      root: {
        color: "#FFF",
        fontFamily:"Montserrat,sans-serif"
      }
    })(Typography);
    return (
    <div> 
      <div class ="header-content">
          <h5>Room</h5>
      </div>  

      <div class='extra'>
      </div>
      <Grid container spacing={2}>

        <Grid item xs={12} align="center">
          <WhiteTextTypography variant="h4" component="h4">
            Code: {this.roomCode}
          </WhiteTextTypography>
        </Grid>
 

        <Grid item xs={12} align="center">
          <MusicPlayer {...this.state.song} />
        </Grid>

        
        
        <Grid item xs={12} align="center">
          {this.state.isHost ? this.renderSettingsButton() : null}
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
      <div class="extra"></div>
    </div>
    );
  }
  

  render(){
    return ( 
      this.renderRoomDetail()
    );
  }
}
