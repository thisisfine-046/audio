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
            <div>
                <div class ="header-content">
                    <h5>Your Playlist</h5>
                </div>

                <div class="dash-title1">
                    <h2 class="Overview" href="" >Playlist</h2>
                    <h2 class="Overview"  href="" >Artists</h2>
                    <h2 class="Overview" href="" >Album</h2>
                </div>
                <div class="dash-cards-title">
                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://wallpapercave.com/wp/wp1828025.png" alt=""/>
                            <span class="content">Something</span>
                        </div>
                    </div>

                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://images.unsplash.com/photo-1510216283985-18086caa8de4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt=""/>
                            <span class="content">Something</span>
                        </div>  
                    </div>


                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://i.pinimg.com/originals/eb/a0/2a/eba02a7b3e4375b32f129c0a04bdd428.jpg" alt=""/>
                            <span class="content">Something</span>
                        </div>  
                    </div>
                </div>

                <div class="dash-cards-title">
                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://wallpapercave.com/wp/wp1828025.png" alt=""/>
                            <span class="content">Something</span>
                        </div>
                    </div>

                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://images.unsplash.com/photo-1510216283985-18086caa8de4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt=""/>
                            <span class="content">Something</span>
                        </div>  
                    </div>


                    <div class="card-title">
                        <div class="overlayer">
                            <i class="material-icons">play_circle</i>

                        </div>

                        <div class="card">
                            <img src="https://i.pinimg.com/originals/eb/a0/2a/eba02a7b3e4375b32f129c0a04bdd428.jpg" alt=""/>
                            <span class="content">Something</span>
                        </div>  
                    </div>
                </div>

                
                <footer>
                </footer>
            </div>
            
        );
    }

    render(){
        return this.renderLibraryPage();
    }
}