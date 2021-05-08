import React , { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import IndexPage from "./IndexPage"
import Room from "./Room"
import LibraryPage from "./Library"
import SearchPage from "./Search"
import ExplorePage from "./Explore"
import LoginPage from './Login'
import { 
    BrowserRouter as Router,
    Switch, 
    Link,
    Route,
    Redirect,
    NavLink,
} 
from "react-router-dom";
import { 
    Button, 
    Grid, 
    ButtonGroup , 
    Typography
} from '@material-ui/core';


export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: null,
            data1: new URLSearchParams(window.location.search).get("code")
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);

    }

    async componentDidMount() {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                roomCode: data.code,
                });
            });
 
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
    
    clearRoomCode() {
        this.setState({
          roomCode: null,
        });
    }


    render(){
        const hello = this.state.data1;
        const loginpls = "please login"
        return (
            <Router>
                <Switch>
                    <Route 
                        exact path="/"
                        component={ExplorePage} 

                        /*
                        render={() => {
                            return <SearchPage  code={hello} />;
                            }}
                            */
                        
         
                    />  
                    <Route 
                        path="/roompage"
                        render={() => {
                            return this.state.roomCode ? (
                              <Redirect to={`/room/${this.state.roomCode}`} />
                            ) : (
                              this.renderRoomPage()
                            );
                        }}

                    />        
                    <Route path="/join" component={RoomJoinPage} />
                    <Route path="/create" component={CreateRoomPage} />
                    <Route 
                        path="/room/:roomCode"
                        render={(props) => {
                        return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                        }}
                    />

                    <Route path="/explore" component={ExplorePage} />
                    <Route 
                    path="/search" 
                    render={() => {
                        return <SearchPage data={hello}/>;
                    }}                    />
                    <Route path="/library" component={LibraryPage} />

                    <Route path="/login" component={LoginPage} />
                </Switch>

            </Router>
        );
    }
}