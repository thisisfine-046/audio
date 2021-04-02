import React , { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import IndexPage from "./IndexPage"
import Room from "./Room"
import LibraryPage from "./Library"
import SearchPage from "./Search"
import ExplorePage from "./Explore"
import { 
    BrowserRouter as Router,
    Switch, 
    Link,
    Route,
    Redict } 
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
    
    
    
    clearRoomCode() {
        this.setState({
          roomCode: null,
        });
    }
    render(){
        return (
            <Router>
                <Switch>
                    <Route 
                        exact path="/"
                        component={IndexPage}
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
                    <Route path="/search" component={SearchPage} />
                    <Route path="/library" component={LibraryPage} />
                </Switch>

            </Router>
        );
    }
}