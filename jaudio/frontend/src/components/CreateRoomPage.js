import React, { Component } from "react";

import { 
    Button, 
    Grid, 
    Typography, 
    TextField, 
    FormControl ,
    FormHelperText,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@material-ui/core';

import { Link } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "",
      successMsg: "",
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);

  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

  handleRoomButtonPressed() {
   // console.log(this.state); test show log
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push('/room/'+ data.code));
  }


  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: "Room updated successfully!",
        });
      } else {
        this.setState({
          errorMsg: "Error updating room...",
        });
      }
      this.props.updateCallback();
    });
  }


  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }


  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            Create A Room
          </Button>
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
  


  renderCreateRoom(){

    const title = this.props.update ? "Update Room" : "Create a Room";
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
      <Grid container spacing={3}>

        <Grid item xs={12} align="center">
          <WhiteTextTypography  variant="h4">
            {title}
          </WhiteTextTypography>
        </Grid>


        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <WhiteTextTypography >
              <div align="center" class="notecolor">Guest Control of Playback State</div>
            </WhiteTextTypography>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleVotesChange}
              defaultValue={this.state.votesToSkip}
              color="primary"
              variant="outlined"
              inputProps={{
                min: 1,
                style: { textAlign: "center" ,color:"white"},
              }}
            />
            <WhiteTextTypography>
              <div align="center" class="notecolor">Votes Required To Skip Song</div>
            </WhiteTextTypography>
          </FormControl>
        </Grid>

        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()
        }
          
      </Grid>
      
    </div>
    );
  }

  render() {
    return (
      this.renderCreateRoom()
    );
  }
}