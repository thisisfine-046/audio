import React , { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import IndexPage from "./IndexPage"
import Room from "./Room"
import LoginPage from './Login'
import GlobalTopAllPage from './GlobalTopAllPage'
import TopHitAllPage from './TopHitAllPage'
import NewReleaseAllPage from './NewReleaseAllPage'
import RecentPlayAllPage from './RecentPlayAllPage'
import UserTopArtistAllPage from './UserTopArtistAllPage'
import UserTopTrackAllPage from './UserTopTrackAllPage'
import JumpBackAllPage from './JumpBackAllPage'
import UserTimeCapsuleAllPage from './UserTimeCapsule'
import UserTodayAllPage from './UserTodayAllPage'
import GetRecommendPage from "./GetRecommend"
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

import Explorev2 from "./Explorev2"
import Search_Spotity from "./Search_Spotity"
import Libraryv2 from "./Libraryv2"

import { withStyles } from "@material-ui/core/styles";


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
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
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

        </div>
        );
    } 
    
    clearRoomCode() {
        this.setState({
          roomCode: null,
        });
    }


    render(){
        const hello = this.state.data1;
        return (
            <Router>
                <Switch>
                    <Route 
                        exact path="/"
                        component={Explorev2} 
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

                    <Route path="/explore" component={Explorev2} />
                    <Route 
                    path="/search" 
                    render={() => {
                        return <Search_Spotity data={hello}/>;
                    }}                    
                    />
                    <Route path="/library" component={Libraryv2} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/global-top" component={GlobalTopAllPage} />
                    <Route path="/today-top" component={TopHitAllPage} />
                    <Route path="/new-release" component={NewReleaseAllPage} />
                    <Route path="/recent-play" component={RecentPlayAllPage} />
                    <Route path="/user-top-track" component={UserTopTrackAllPage} />
                    <Route path="/user-top-artist" component={UserTopArtistAllPage} />
                    <Route path="/jump-back" component={JumpBackAllPage} />
                    <Route path="/user-time-capsule" component={UserTimeCapsuleAllPage} />
                    <Route path="/user-today" component={UserTodayAllPage} />
                    <Route path="/get-recommend" component={GetRecommendPage} />
                </Switch>

            </Router>
        );
    }
}