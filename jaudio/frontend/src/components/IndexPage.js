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

export default class IndexPage extends Component{
    constructor(props){
        super(props);
        
    }
    

    renderRoomPage(){
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        Room Discord
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                        Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    render(){
        return (this.renderRoomPage());
    }
}