import React , { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import IndexPage from "./IndexPage"
import Room from "./Room"
import { 
    BrowserRouter as Router,
    Switch, 
    Link,
    Route,
    Redict } 
from "react-router-dom";



export default class HomePage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <Router>
            <switch>
                <Route exact path = "/" component={IndexPage} />            
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/create" component={CreateRoomPage} />
                <Route path ="/room/:roomCode" component = {Room}/>
            </switch>
        </Router>
    }
}