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
import ContentBase from "./ContentBase"

import MySaved from "./MySaved"

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
                //console.log(e);
                setData(data);
            }
        };
        fetchUsers();
    }, []);


    const accessToken = data.access_token
    const [TopToday, setTopToday] = useState([])
    const [playingTrack, setPlayingTrack] = useState()

    function chooseTrack(track) {
        setPlayingTrack(track)
    }

    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    },[accessToken])



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
    console.log(checkSaved)
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



   
    // today top 3
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getPlaylistTracks(
            '37i9dQZF1DXcBWIGoYBM5M' , {
                limit: 4,
                fields: 'items'
              })
        .then(res => {
            setTopToday(
                res.body.items.map(item =>{
                    return {
                        artists : item.track.artists.map(x=>x.name+" "),
                        title : item.track.name,
                        id: item.track.id,
                        uri: item.track.uri,
                        albumUrl: item.track.album.images[0].url,
                    }
                })
            )
        })
    },[accessToken])

    // const USER_RECOMMEND = 'http://127.0.0.1:8000/spotify/get-recommend';
    // const [GetEecommend, setGetRecommend] = useState([])

    // useEffect(() => {
    //     fetch(USER_RECOMMEND)
    //       .then(res => res.json())
    //       .then(
    //         (result) => {
    //             setGetRecommend(
    //                 result.map( item => {
    //                     return {
    //                         artist: item.artist,
    //                         img: item.img,
    //                         title: item.name,
    //                         uri: item.uri,
    //                     }
    //                 })
    //             )
    //         },  
    //         (error) => {
    //           setError(error);
    //         }
    //       )
    // }, [GetEecommend])
    

    // get GlobalTop
    const [GlobalTop, setGlobalTop] = useState([])

    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getPlaylistTracks(
            '37i9dQZEVXbMDoHDwVN2tF' , {
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
                        id: item.track.id,
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
                        id: item.track.id,
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
                        id: item.id,
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
        })
        .then(res => {
            setSaveTrack(
                res.body.items.map(item => {
                    return{
                        artists : item.track.artists[0].name,
                        artistsURI : item.track.artists[0].uri,
                        artistsID : item.track.artists[0].id,
                        uri : item.track.uri,
                        id: item.track.id,
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
                        id: item.track.id,
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
                        id: item.id,
                        uri : item.uri,
                        title : item.name,
                        albumUrl: item.images[0].url,
                    }
                })
            )
        })
        
    },[accessToken])


    //get first playlist
    const [myPlaylist, setmyPlaylist] = useState([])
    //get me
    //const ItMe = "31nejoonlzakyigpwzopswci2sri"

    const [getMe, setGetMe] = useState([])
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getMe()
        .then(res => {
            //console.log(res.body)
            setGetMe(res.body.id)  
        })
    },[accessToken])

    // get User Library
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getUserPlaylists({getMe})
        .then(res => {
            setmyPlaylist(
                res.body.items[0].name
            )
        })
    },[accessToken])
    // console.log(myPlaylist)

    // const [firstPlaylist, lastPlaylistsetLooking] = useState()
    // useEffect(() => {
    //     lastPlaylistsetLooking(myPlaylist)
    // }, [myPlaylist])




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
                        saveChooseTrack={SavedTrack}
                    />
                ))}
            </div>


            <div class="dash-title">
                <h2  >Jump Back In</h2>
                <a class="see-all" href="/jump-back" >See More</a>
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
                        saveChooseTrack={SavedTrack}
                    />
                ))}

            </div>


            <div class="dash-title">
                <h2  >Recently Played</h2>
                <a class="see-all" href="/recent-play" >See More</a>
            </div>
                
            <div class="dash-cards-small">
                {recentPlay.map(item =>(
                    <RecentPlay
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                        saveChooseTrack={SavedTrack}

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
                            saveChooseTrack={SavedTrack}

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
                            saveChooseTrack={SavedTrack}
                        />
                ))}
            </div>


            <div class="dash-title">
                <h2 >For Today</h2>
                <a class="see-all" href="/user-today">See More</a>
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
                <h2  >Time Capsule</h2>
                <a class="see-all" href="/user-time-capsule">See More</a>
            </div>
                
            <div class="dash-cards-small">
                {backintime.map(item =>(
                    <Globaltopv2
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                        saveChooseTrack={SavedTrack}
                    />
                ))}
            </div>
            

            <div class="dash-title">
                <h2> Base on: {myPlaylist}</h2>
                <a class="see-all" href="/get-recommend">See More</a>
            </div>
                
            {/* <div class="dash-cards-small">
                {GetEecommend.map(item =>(
                    <ContentBase
                        track = {item}
                        key ={item.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>  */}



            <div class="dash-title">
                <h2>Top Artists</h2>
                <a class="see-all" href="/user-top-artist">See More</a>
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