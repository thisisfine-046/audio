import React , { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { 
    Button, 
    Grid, 
    Typography, 
    TextField, 

} from '@material-ui/core';

import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode : "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    render(){
        const WhiteTextTypography = withStyles({
            root: {
              color: "#FFF",
              fontFamily:"Montserrat,sans-serif"
            }
          })(Typography);
        return (
        <div>
            <div class ="header-content">
                <h5>Discover new music every day</h5>
                <h3>Millions of songs and podcasts. No credit card needed.</h3>
            </div>  

            <div class='extra'>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} align="center">
                    <WhiteTextTypography variant="h4" component="h4">
                        Join a Room
                    </WhiteTextTypography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="Code"
                        color="primary"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        inputProps={{
                            style: { textAlign: "center" ,color:"white"},
                        }}
                        onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.roomButtonPressed}
                    >
                        Enter Room
                    </Button>

                    <Button variant="contained" color="secondary" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>

          </Grid>
        </div>
        );
    
    }

    handleTextFieldChange(e){
        this.setState({
            roomCode: e.target.value,
        });

    }

    roomButtonPressed() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: this.state.roomCode,
          }),
        };
        fetch("/api/join-room", requestOptions)
          .then((response) => {
            if (response.ok) {
              this.props.history.push(`/room/${this.state.roomCode}`);
            } else {
              this.setState({ error: "Room not found." });
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
}