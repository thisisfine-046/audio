import React,{ Component} from "react";
import { render } from "react-dom";
import HomePage from "./HomePage"
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"


export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
          hello: "hello"
        }
    }
    render(){
        return (
            <div className = "center">
                <HomePage />
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App  />,appDiv)
