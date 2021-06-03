import React, { useEffect, useState } from 'react'
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import TopTodayv2 from "./TopTodayv2"
import Streaming from './Streaming';
import Globaltopv2 from "./Globaltopv2"
import RecentPlay from "./RecentPlay"
import NewReleasesv2 from "./NewReleasesv2"
import UserArtist from "./UserArtist"
import FeaturePlaylist from "./FeaturePlaylist"
import { 
    Button, 
    Grid, 
    Typography, 
    TextField,
    decomposeColor, 
} from '@material-ui/core';

// window.onload=function(){
//     const header = document.querySelector("header");
//     const sectionOne = document.querySelector(".header-content");
  
//     const sectionOneOptions = {
//       rootMargin: "-100px 0px 0px 0px"
//     };
  
//     const sectionOneObserver = new IntersectionObserver(function(
//       entries,
//       sectionOneObserver
//     ) {
//       entries.forEach(entry => {
//         if (!entry.isIntersecting) {
//           header.classList.add("nav-scrolled");
//         } else {
//           header.classList.remove("nav-scrolled");
//         }
//       });
//     },
//     sectionOneOptions);
  
//     sectionOneObserver.observe(sectionOne);
// }
const spotifyApi = new SpotifyWebApi({
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
})


export default function Explorev2() {
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


    const USER_RECOMMEND = 'http://127.0.0.1:8000/spotify/get-recommend';
    const [recommend, setRecommend] = useState({});
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(USER_RECOMMEND);
                console.log(response);
                setRecommend(response);
            } catch (e) {
                console.log(e);
                setRecommend(data);
            }
        };
        fetchUsers();
    }, []);
    


    const [TopToday, setTopToday] = useState([])
    const [playingTrack, setPlayingTrack] = useState()

    function chooseTrack(track) {
        setPlayingTrack(track)
    }

    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    },[accessToken])


   
    // today top 3
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getPlaylistTracks(
            '37i9dQZF1DXcBWIGoYBM5M' , {
                offset: 1,
                limit: 4,
                fields: 'items'
              })
        .then(res => {
            setTopToday(
                res.body.items.map(item =>{
                    return {
                        artists : item.track.artists.map(x=>x.name+" "),
                        title : item.track.name,
                        uri: item.track.uri,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
    },[accessToken])


    // get GlobalTop
    const [GlobalTop, setGlobalTop] = useState([])

    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getPlaylistTracks(
            '37i9dQZEVXbMDoHDwVN2tF' , {
                offset: 1,
                limit: 7,
                fields: 'items'
              })
        
        .then(res => {
            setGlobalTop(
                res.body.items.map(item =>{
                    return {
                        artists : item.track.artists.map(x=>x.name+" ") , 
                        title : item.track.name,
                        uri: item.track.uri,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
    },[accessToken])


    // get recentplay
    const [recentPlay, setRecentPlay] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMyRecentlyPlayedTracks({
            limit : 7
        })
        
        .then(res => {
            setRecentPlay(
                res.body.items.map(item =>{
                    return {
                        artists : item.track.artists.map(x=>x.name+" ") , 
                        title : item.track.name,
                        uri: item.track.uri,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
    },[accessToken])

    //get new release track and album
    const [newReleases, setnewReleases] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getNewReleases({
            limit : 7,
            country: 'US'
        })
        
        .then(res => {
            setnewReleases(
                
                res.body.albums.items.map(item =>{ 
                    return{
                        artists : item.artists.map(x=>x.name+" ") , 
                        title : item.name,
                        uri: item.uri,
                        albumUrl: item.images[0].url,
                    }
                })
            )
            
        })
    },[accessToken])

    //get my top
    const [myTrack, setnmyTrack] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMyTopTracks({
            limit : 7
        })
        
        .then(res => {
            setnmyTrack(
                res.body.items.map(item =>{
                    return{
                        artists : item.artists[0].name , 
                        title : item.name,
                        uri: item.uri,
                        id: item.id,
                        albumUrl: item.album.images[0].url,
                    }
                })
           
            )
        })
    },[accessToken])

 


    //get artists
    const [newArtists, setnewArtists] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMyTopArtists({
            limit :5
        })
        
        .then(res => {
            setnewArtists(
                res.body.items.map(item =>{
                    return{
                        artists : item.name, 
                        uri: item.uri,
                        albumUrl: item.images[0].url,
                        id : item.id,
                    }
                })
           
            )
        })
    },[accessToken])


    //get saved tracks    
    const [saveTracks, setSaveTrack] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMySavedTracks({
            limit : 7,
            offset: 1
        })
        .then(res => {
            setSaveTrack(
                res.body.items.map(item => {
                    return{
                        artists : item.track.artists[0].name,
                        artistsURI : item.track.artists[0].uri,
                        artistsID : item.track.artists[0].id,
                        uri : item.track.uri,
                        title : item.track.name,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
        
    },[accessToken])

    //back in time   
    const [backintime, setBackintime] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMySavedTracks({
            limit : 7,
            offset: 20
        })
        .then(res => {
            setBackintime(
                res.body.items.sort((a,b) => a.added_at < b.added_at).map(item => {
                    return{
                        addAt : item.added_at,
                        artists : item.track.artists[0].name,
                        artistsURI : item.track.artists[0].uri,
                        artistsID : item.track.artists[0].id,
                        uri : item.track.uri,
                        title : item.track.name,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
        
    },[accessToken])


    //get user-today    
    const [TryToday, setTryToday] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getFeaturedPlaylists({ 
            limit : 7
            , offset: 1, country: 'US' })
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
                <h5>Discover new music every day</h5>
                <h3>Millions of songs and podcasts. No credit card needed.</h3>
            </div>    

            <div class="dash-title">
                <h2 class="Overview" >Today's Top Hit</h2>
                <a class="see-all" href="/today-top">See More</a>
            </div>

            <div class="dash-cards-title">
                {TopToday.map(item => (
                    <TopTodayv2 
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>


            <div class="dash-title">
                <h2  >Jump Back In</h2>
                <a class="see-all" href="/jump-back" >See More</a>
            </div>
                
            <div class="dash-cards-small">
                {saveTracks.map(item =>(
                    <Globaltopv2
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>


            <div class="dash-title">
                <h2 class="New-releases" >New Releases</h2>
                <a class="see-all" href="/new-release">See More</a>
            </div>
                
            <div class="dash-cards-small">
                    
                {newReleases.map(item =>(
                    <NewReleasesv2
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}

            </div>


            <div class="dash-title">
                <h2  >Recently Played</h2>
                <a class="see-all" >See More</a>
            </div>
                
            <div class="dash-cards-small">
                {recentPlay.map(item =>(
                    <RecentPlay
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>

            <div class="dash-title">
                <h2 class="trending" >Top Global</h2>
                <a class="see-all" href="/global-top">See More</a>
            </div>

            <div class="dash-cards-small">
                {GlobalTop.map(item => (
                        <Globaltopv2 
                            track = {item}
                            key ={item.uri}
                            chooseTrack={chooseTrack}
                        />
                ))}
            </div>

            <div class="dash-title">
                <h2> Your Top Artists</h2>
                <a class="see-all" href="/user-top-artist">See All</a>
            </div>
            <div class="dash-cards-circle">
                {newArtists.map(item => (
                        <UserArtist 
                            track = {item}
                            key ={item.uri}
                            chooseTrack={chooseTrack}
                        />
                ))}
            </div>



            <div class="dash-title">
                <h2 > My Styles</h2>
                <a class="see-all" href="/user-top-track">See More</a>
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


            <div class="dash-title">
                <h2 >For Today</h2>
                <a class="see-all" href="/user-today">See All</a>
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

            <div class="dash-title">
                <h2  >My Time Capsule</h2>
                <a class="see-all" href="/user-time-capsule">See More</a>
            </div>
                
            <div class="dash-cards-small">
                {backintime.map(item =>(
                    <Globaltopv2
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>



            <div class='extra'>
            </div>
            <div class='progress'>
                <Streaming  
                    accessToken = {accessToken}
                    trackUri = {playingTrack?.uri}  
                />
            </div>
    </div>
        
    );
}

