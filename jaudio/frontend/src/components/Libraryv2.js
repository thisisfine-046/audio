import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from 'react-spotify-web-playback';
import MyPlaylist from './MyPlaylist'

const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function Libraryv2() {
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
    const songs_uri = "spotify:track:5cvbog6wen3r3bBbcwL16U";
    const ItMe = "31nejoonlzakyigpwzopswci2sri"
    const [getMe, setGetMe] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    },[accessToken])

    //get me
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMe()
        .then(res => {
            // console.log(res.body)
            setGetMe(res.body)  
        })
    },[accessToken])



    const [myPlaylist, setmyPlaylist] = useState([])

    // get User Library
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getUserPlaylists({ItMe})
        .then(res => {
            // console.log(res.body.items)
            setmyPlaylist(
                res.body.items.map(item =>{
                    return{
                        playlistName : item.name,
                        playlistPic: item.images[0].url,
                        playlistID: item.id,
                        playlistURI: item.uri,
                    }
        
                })
            )
        })
    },[accessToken])
    console.log(myPlaylist)



    function choosePlaylist(playlistclick) {
        setPlayingTrack(playlistclick)
    }

    return (
        <div>
            <div class ="header-content">
            <h5>Your Library</h5>
        </div>
            <div class="dash-title">
                <h2 class="New-releases" >Library</h2>
            </div>
            <div class="dash-cards-small">
                    {myPlaylist.map(item => (
                        <MyPlaylist 
                            item = {item}
                            key = {item.id}
                            choosePlaylist = {choosePlaylist}
                        />
                    ))}
            </div>
        </div>
    )
}
