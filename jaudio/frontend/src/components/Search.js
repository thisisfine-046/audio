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


  
export default class SearchPage extends Component{
    constructor(props){
        super(props);
        
    }

    
    

    renderSearchPage(){
        return (
            <h1>Search Tab</h1>
        );
    }

    render(){
        return this.renderSearchPage();
    }
}