import React, { useEffect, useState } from 'react';
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from 'react-spotify-web-playback';
import TrackSearchResult from './TrackSearchResult';
import Streaming from './Streaming';
import Search_Afterthat from './Search_after'
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

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [looking, setLooking] = useState("")

    
    const [playingTrack, setPlayingTrack] = useState()

    useEffect(() => {
        if(!searchResults) return

        setLooking(
            "Your looking for ..."
        )
    }, [playingTrack])

    function chooseTrack(track) {
        setPlayingTrack(track)
    }

    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    },[accessToken])


    const [recommend, setRecommend] = useState([])

    // get recommendation
    useEffect(() => {
        if(!playingTrack) return

        spotifyApi.getRecommendations({
            seed_artists: [playingTrack.artistID, playingTrack.trackID],
            limit:21,
            min_popularity: 50
        })
        .then(res => {
            setRecommend(
                res.body.tracks.map(track =>{
                    return {
                        artist : track.artists.map(x=>x.name+" "),
                        artistID : track.artists[0].id,
                        artistURI: track.artists[0].uri,
                        title : track.name,
                        uri: track.uri,
                        id: track.id,
                        albumUrl: track.album.images[0].url,
                    }
                })
            )
        })

    }, [playingTrack, accessToken])


    const [moreof , setMoreof] = useState([])
    // get more of this artist
    useEffect(() => {
        if(!playingTrack) return

        spotifyApi.getArtistTopTracks(playingTrack.artistID, 'US')
        .then(res => {
            console.log(res.body)
            setMoreof(
                res.body.tracks.map(track =>{
                    return {
                        artist : track.artists.map(x=>x.name+" "),
                        artistID : track.artists[0].id,
                        artistURI: track.artists[0].uri,
                        title : track.name,
                        uri: track.uri,
                        id: track.id,
                        albumUrl: track.album.images[0].url,
                    }
                })
            )
        })

    }, [playingTrack, accessToken])

  

    // get search
    useEffect(() => {
        if(!search) return setSearchResults([])
        if(!accessToken) return 


        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    
                    return {
                        artist : track.artists.map(x=>x.name+" "),
                        artistID : track.artists[0].id,
                        artistURI: track.artists[0].uri,
                        title : track.name,
                        uri: track.uri,
                        id: track.id,
                        albumUrl: track.album.images[0].url,
                    }
                })
            )
        })
        return () => (cancel = true)

    }, [search, accessToken])


    const [WannaSaveTrack, setWannaSaveTrack] = useState()
    const [checkSaved, setCheckSaved] = useState(false)

    function SavedTrack(track) {
        setWannaSaveTrack(track)   
    }
    //console.log(WannaSaveTrack)
    // // check if added yet ?
    useEffect(() =>{
        if (!WannaSaveTrack) return
        spotifyApi.containsMySavedTracks([WannaSaveTrack.id])
        .then(function(data) {

            // An array is returned, where the first element corresponds to the first track ID in the query
            var trackIsInYourMusic = data.body[0];

            if (trackIsInYourMusic) {
            setCheckSaved(true)
            } else {
            setCheckSaved(false)
            }
        }, function(err) {
            console.log('Something went wrong!', err);
        });

    },[WannaSaveTrack])
    
    // add to Saved Tracks
    useEffect(()=>{
        if (!WannaSaveTrack) return
        if(checkSaved) return
        spotifyApi.addToMySavedTracks([WannaSaveTrack.id])
        .then(function(data) {
            console.log('Added track!');
        }, function(err) {
            console.log('Something went wrong!', err);
        });      

    },[WannaSaveTrack])



    return (
        
        <div>
                <div class ="header-content">
                        <h5>Search For Things</h5>
                </div>

                <div class="search-wrapper">
                    <span class="ti-search"></span>
                    <input type="search" placeholder="What you're looking for" value={search}
                            onChange={e => setSearch(e.target.value)}/>
                </div>
                <div>
                    <div class="dash-title">
                        <h2> {search ? "Your Result: " + search :" "}</h2>
                    
                    </div>
                    <div class="dash-cards-small">
                            {searchResults.map(track => (
                                <TrackSearchResult 
                                    track = {track} 
                                    key ={track.uri}
                                    chooseTrack={chooseTrack}
                                    saveChooseTrack={SavedTrack}
                                />
                            ))}
                    </div> 


                </div>

                <div>
                    <div class="dash-title">
                        <h2> {playingTrack ? "Simmilar to " + playingTrack.title : ""}</h2>
                    
                    </div>
                    <div class="dash-cards-small">                          
                            {recommend.map(track => (
                            <Search_Afterthat 
                                track = {track} 
                                key ={track.uri}
                                chooseTrack={chooseTrack}
                                saveChooseTrack={SavedTrack}
                            />
                        ))}
                    </div>

                </div>

                
                <div>
                    <div class="dash-title">
                        <h2>{playingTrack ? "More of " + playingTrack.artist : ""}</h2>
                    </div>
                    <div class="dash-cards-small">                          
                            {moreof.map(track => (
                            <Search_Afterthat 
                                track = {track} 
                                key ={track.uri}
                                chooseTrack={chooseTrack}
                            />
                        ))}
                    </div>

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
