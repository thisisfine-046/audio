import React , { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
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
                <Route exact path = '/'>
                    <p>
                        This is the Home Page
                    </p>
                </Route>
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/create" component={CreateRoomPage} />
            </switch>
        </Router>
    }
}