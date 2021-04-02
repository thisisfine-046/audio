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


  
export default class LibraryPage extends Component{
    constructor(props){
        super(props);
        
    }

    
    

    renderLibraryPage(){
        return (
            <h1>Library Tab</h1>
        );
    }

    render(){
        return this.renderLibraryPage();
    }
}