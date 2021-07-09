import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import Streaming from './Streaming';
import NewReleasesv2 from './NewReleasesv2'

import MySaved from "./MySaved"

const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function JumpBackAllPage() {


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
    

    const [saveTracks, setSaveTrack] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMySavedTracks({
        })
        .then(res => {
            setSaveTrack(
                res.body.items.map(item => {
                    return{
                        artists : item.track.artists[0].name,
                        artistsURI : item.track.artists[0].uri,
                        artistsID : item.track.artists[0].id,
                        uri : item.track.uri,
                        id : item.track.id ,
                        title : item.track.name,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
        
    },[accessToken])


    const [WannaSaveTrack, setWannaSaveTrack] = useState()

    function SavedTrack(track) {
        setWannaSaveTrack(track)
    }

    useEffect(()=>{
        if (!WannaSaveTrack) return
        spotifyApi.removeFromMySavedTracks([WannaSaveTrack.id])
        .then(function(data) {
            console.log('Removed!');
        }, function(err) {
            console.log('Something went wrong!', err);
        });       

    },[WannaSaveTrack])
    
    

    return (
        <div>
            <div class ="header-content">
                <h5>YOUR SAVED TRACKS</h5>
            </div>
            <div class="dash-title">
            </div>
            <div class="dash-cards-small">
                {saveTracks.map(item =>(
                    <MySaved
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                        RemoveChooseTrack={SavedTrack}

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
