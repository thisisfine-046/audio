import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import Streaming from './Streaming';
import FeaturePlaylist from "./FeaturePlaylist"

const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function UserTodayAllPage() {
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
    const [playingTrack, setPlayingTrack] = useState()

    function chooseTrack(track) {
      setPlayingTrack(track)
    }
    
    useEffect(() => {
      if(!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    },[accessToken])
    

    const [TryToday, setTryToday] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getFeaturedPlaylists({ 
             country: 'US' })
        .then(res => {
            setTryToday(
                res.body.playlists.items.map(item => {
                    return{
                        playlist : item.owner.display_name,
                        
                        uri : item.uri,
                        title : item.name,
                        albumUrl: item.images[0].url,
                    }
                })
            )
        })
        
    },[accessToken])
    
    

    return (
        <div>
            <div class ="header-content">
                <h5>FOR YOU TODAY</h5>
            </div>
            <div class="dash-title">
            </div>
            <div class="dash-cards-small">
                {TryToday.map(item => (
                        <FeaturePlaylist 
                            track = {item}
                            key ={item.uri}
                            chooseTrack={chooseTrack}
                        />
                ))}
            </div>
            

            <div class="extra">

            </div>

            <div class='progress'>
                <Streaming  
                    accessToken = {accessToken}
                    trackUri = {playingTrack?.uri}  
                />
            </div>
        </div>
    )
}
