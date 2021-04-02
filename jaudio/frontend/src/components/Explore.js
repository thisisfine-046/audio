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


  
export default class ExplorePage extends Component{
    constructor(props){
        super(props);
        
    }

    
    

    renderExplorePage(){
        return (
            
                <div>
                    <h3>Explore Tab</h3>

                </div>
            
        );
    }

    render(){
        return this.renderExplorePage();
    }
}