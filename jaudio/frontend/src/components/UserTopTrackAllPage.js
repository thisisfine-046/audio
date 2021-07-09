import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import Streaming from './Streaming';
import Globaltopv2 from "./Globaltopv2"
const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function UserTopTrackAllPage() {

    window.onload=function navbar () {
        const header = document.querySelector("header");
        const sectionOne = document.querySelector(".header-content");

        const sectionOneOptions = {
          rootMargin: "-100px 0px 0px 0px"
        };

        const sectionOneObserver = new IntersectionObserver(function(
          entries,
          sectionOneObserver
        ) {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              header.classList.add("nav-scrolled");
            } else {
              header.classList.remove("nav-scrolled");
            }
          });
        },
        sectionOneOptions);

        sectionOneObserver.observe(sectionOne);
    }


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
    

    const [myTrack, setnmyTrack] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMyTopTracks({
        })
        
        .then(res => {
            setnmyTrack(
                res.body.items.map(item =>{
                    return{
                        artists : item.artists[0].name , 
                        title : item.name,
                        uri: item.uri,
                        albumUrl: item.album.images[0].url,
                    }
                })
           
            )
        })
    },[accessToken])
    
    

    return (
        <div>
            <div class ="header-content">
                <h5>YOUR TOP TRACK</h5>
            </div>
            <div class="dash-title">
            </div>
            <div class="dash-cards-small">
                {myTrack.map(item => (
                        <Globaltopv2 
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
