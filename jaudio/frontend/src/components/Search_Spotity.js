import React, { useEffect, useState } from 'react';
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


export default function Search_Spotity({datato}) {
    const USER_SERVICE_URL = 'http://127.0.0.1:8000/spotify/get-access_token';

    const [data, setData] = useState({});

    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(USER_SERVICE_URL);
                setData( response.data);
            } catch (e) {
                console.log(e);
                setData(data);
            }
        };
        fetchUsers();
    }, []);


    const accessToken = data.access_token

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()



    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
    }

    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    },[accessToken])

    useEffect(() => {


        if(!search) return setSearchResults([])
        if(!accessToken) return 


        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    return {
                        artist : track.artists[0].name,
                        title : track.name,
                        uri: track.uri,
                        albumUrl: track.album.images[0].url,
                    }
                })
            )
        })
        return () => (cancel = true)

    }, [search, accessToken])

    
    return (
        <div>
                <div class ="header-content">
                        <h5>Search For things</h5>
                </div>

                <div class="search-wrapper">
                    <span class="ti-search"></span>
                    <input type="search" placeholder="What you're looking for" value={search}
                            onChange={e => setSearch(e.target.value)}/>
                </div>

                <div class="dash-cards-small">
                        {searchResults.map(track => (
                            <TrackSearchResult 
                                track = {track} 
                                key ={track.uri}
                                chooseTrack={chooseTrack}
                            />
                        ))}
                </div> 
                <div class="extra">
                    </div>
                <div class='footer'>
                    <Streaming  
                        accessToken = {accessToken}
                        trackUri = {playingTrack?.uri}
                    />
                </div> 
        </div>    
    )
}
