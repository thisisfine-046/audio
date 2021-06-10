import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import Streaming from './Streaming';
import ContentBase from "./ContentBase"
const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function GetRecommendPage() {
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
    

    const USER_RECOMMEND = 'http://127.0.0.1:8000/spotify/get-recommend1';
    const [GetEecommend, setGetRecommend] = useState([])

    useEffect(() => {
        fetch(USER_RECOMMEND)
          .then(res => res.json())
          .then(
            (result) => {
                setGetRecommend(
                    result.map( item => {
                        return {
                            artist: item.artist,
                            img: item.img,
                            title: item.name,
                            uri: item.uri,
                        }
                    })
                )
            },  
            (error) => {
              setError(error);
            }
          )
    }, [GetEecommend])

    

    return (
        <div>
            <div class ="header-content">
                <h5>RECOMMEND FOR YOUR PLAYLIST</h5>
            </div>
            <div class="dash-title">
            </div>
            <div class="dash-cards-small">
                {GetEecommend.map(item =>(
                    <ContentBase
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
