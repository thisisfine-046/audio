import React , { Component } from 'react';

import { 
    Button, 
    Grid, 
    Typography, 
} from '@material-ui/core';
import {
    Link
} from "react-router-dom";


export default class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetail();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);

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

    renderRoomDetail(){
        return (
            <Grid container spacing={1}>
              <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                  Code: {this.roomCode}
                </Typography>
              </Grid>
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
                  Leave Room
                </Button>
              </Grid>
            </Grid>
          );
    }
    render(){
        return this.renderRoomDetail();
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
