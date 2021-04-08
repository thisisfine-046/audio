import React , { Component } from 'react';

import { 
    Button, 
    Grid, 
    Typography, 
} from '@material-ui/core';

import CreateRoomPage from './CreateRoomPage'

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSetting: false,
            spotifyAuthenticated: false,
        };
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingButton = this.renderSettingButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetail = this.getRoomDetail.bind(this);

        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getRoomDetail();

    }



    getRoomDetail(){
        return fetch("/api/get-room" + "?code=" + this.roomCode)
        .then((response) => {
          if (!response.ok) {
              this.props.leaveRoomCallback();
              this.props.history.push("/");
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
              votesToSkip: data.votes_to_skip,
              guestCanPause: data.guest_can_pause,
              isHost: data.is_host,
          });
          if(this.state.isHost){
              this.authenticateSpotify();
          }
        });
        /*
        fetch('/api/get-room' + '?code=' +this.roomCode).then((response) => response.json()).then((data) =>{
            
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                }); 
            });
        */
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

    renderSettingButton(){
        return(
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.updateShowSettings(true)}
              >
                Settings
              </Button>
            </Grid>
        );
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
              updateCallback={this.getRoomDetail()}
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
  renderRoomDetail(){
    if ( this.state.showSetting){
        return this.renderSettings()
    }
    return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {this.roomCode}
            </Typography>
          </Grid>
          {this.state.isHost ? this.renderSettingButton() : null}

          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Votes: {this.state.votesToSkip}
            </Typography>
          </Grid>


          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Guest Can Pause: {this.state.guestCanPause.toString()}
            </Typography>
          </Grid>


          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Host: {this.state.isHost.toString()}
            </Typography>
          </Grid>


          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.leaveButtonPressed}
            >
              Leave Rooafew
            </Button>
          </Grid>
        </Grid>
      );
    }

    render(){
        return ( 
          this.renderRoomDetail()
        );
    }
}
/*
return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>
            </div>
        );
*/