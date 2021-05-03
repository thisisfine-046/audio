import React , { Component } from 'react';
import useAuth from "./useAuth"

import { 
    Button, 
    Grid, 
    Typography, 
    TextField, 

} from '@material-ui/core';
export default class SearchPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            code: this.props.data,
            seachword:"",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);


    }
    renderSearchPagePage(){
        const data = this.props;
        return (
            <div>
                <div class ="header-content">
                        <h5>Your Playlist</h5>
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h4" component="h4">
                            {this.state.code}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField
                            label="Code"
                            color="primary"
                            placeholder="Search for Songs"
                            value={this.state.seachword}
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
                            
                        >
                            Enter Room
                        </Button>
                    </Grid>
                    
                </Grid>
                <footer>
                </footer>    
            </div>    
          );
    }

    handleTextFieldChange(e){
        this.setState({
            seachword: e.target.value,
        });

    }

    render(){
        return this.renderSearchPagePage();
    }
}
/*
export default function SearchPage({code}) {

    return (
        <div class="container" id="container"> 
            <h1>hello</h1>
            {code}
        </div>
    )
}
*/



