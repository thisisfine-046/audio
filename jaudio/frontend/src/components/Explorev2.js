import React , { Component } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from 'react-spotify-web-playback';
import TrackSearchResult from './TrackSearchResult';
import Streaming from './Streaming';

import { 
    Button, 
    Grid, 
    Typography, 
    TextField, 
} from '@material-ui/core';


const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})