import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import Streaming from './Streaming';
import MyPlaylist from './MyPlaylist'
import Search_Afterthat from './Search_after'
import Globaltopv2 from './Globaltopv2'
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
                        title : item.name,
                        playlistPic: item.images[0].url,
                        playlistID: item.id,
                        uri: item.uri,
                    }
        
                })
            )
        })
    },[accessToken])


    const [playlistName, setPlayListName]  = useState([])
    function choosePlaylist(playlistclick) {
        setPlayingTrack(playlistclick)
        setPlayListName(myPlaylist)
    }
    
    

    const [showplaylist , setShowPlaylist]=useState([])

    useEffect(() => {
        if(!accessToken) return 
        if (!playingTrack) return
        spotifyApi.getPlaylist(playingTrack.playlistID)
        .then(res => {
            console.log(res)
            setShowPlaylist(
                res.body.tracks.items.map(item =>{
                    return {
                        artists : item.track.artists.map(x=>x.name+" "),
                        title : item.track.name,
                        uri: item.track.uri,
                        duration : item.track.duration_ms,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
    },[playingTrack,accessToken])

    console.log(showplaylist)


    return (
        <div>
            <div class ="header-content">
                <h5>Your Library</h5>
            </div>
            <div class="dash-title">
                <h2 >Library</h2>
            </div>
            <div class="dash-cards-small">
                    {myPlaylist.map(item => (
                        <MyPlaylist 
                            item = {item}
                            key = {item.uri}
                            choosePlaylist = {choosePlaylist}
                        />
                    ))}
            </div>
            <div>
                    <div class="dash-title">
                    <h2> {playingTrack ?  playingTrack.title   : ""}</h2>
                    </div>
                    <div class="dash-cards-small">                          
                            {showplaylist.map(track => (
                            <Globaltopv2 
                                track = {track} 
                                key ={track.uri}
                                chooseTrack={choosePlaylist}
                            />
                        ))}
                    </div>

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
