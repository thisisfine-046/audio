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
                setData(data);
            }
        };
        fetchUsers();
    }, []);

    const accessToken = data.access_token
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
            setGetMe(res.body.id)  
        })
    },[accessToken])



    const [myPlaylist, setmyPlaylist] = useState([])

    // get User Library
    useEffect(() => {
        if(!accessToken) return 
        spotifyApi.getUserPlaylists({getMe})
        .then(res => {
            //console.log(res)
            setmyPlaylist(
                res.body.items.map(item =>{
                    return{
                        title : item.name,
                        playlistPic: item.images[0].url,
                        playlistID: item.id,
                        uri: item.uri,
                        total_tracks:item.tracks.total
                    }
        
                })
            )
        })
    },[accessToken])

    function choosePlaylist(playlistclick) {
        setPlayingTrack(playlistclick)
    }

    const [playingPlaylist, setPlayingPlaylist] = useState()

    function choosePlaylist2(playlistclick) {
        setPlayingPlaylist(playlistclick)
    }


    const [showplaylist , setShowPlaylist]=useState([])

    useEffect(() => {
        if(!accessToken) return 
        if (!playingPlaylist) return
        spotifyApi.getPlaylist(playingPlaylist.playlistID)
        .then(res => {
            //console.log(res)
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
    },[playingPlaylist,accessToken])

    const USER_RECOMMEND = 'http://127.0.0.1:8000/spotify/get-recommend2';
    const [GetEecommend, setGetRecommend] = useState([])

    console.log(playingTrack)
    useEffect(() => {
        if(!playingTrack) return;
        fetch(USER_RECOMMEND)
          .then(res => res.json())
          .then( 
            (res) => {
                setGetRecommend(
                    res.id
                )
            },  
            (error) => {
              setError(error);
            }
          )      
    }, [playingTrack])
    console.log(GetEecommend)


    //get recommend
    const [Recommend, setRecommend] = useState([])

    useEffect(() => {
        if (!GetEecommend) return
        spotifyApi.getTracks([GetEecommend])
        .then(res => {
            setRecommend(
                res.body.tracks.map(item =>{
                    return{
                        id: item.id,
                        uri : item.uri,
                        title : item.name,
                        albumUrl: item.album.images[0].url,
                        artists : item.artists.map(x=>x.name+" "),
                    }
                })
            )
        })
        
    },[GetEecommend])

    console.log(Recommend)



    return (
        <div>
            <div class ="header-content">
                <h5>Your Library</h5>
            </div>
            <div class="dash-title">
                <h2 >Playlist</h2>
            </div>
            <div class="dash-cards-small">
                    {myPlaylist.map(item => (
                        <MyPlaylist 
                            item = {item}
                            key = {item.playlistID}
                            choosePlaylist2 = {choosePlaylist2}
                        />
                    ))}
            </div>
            <div>
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

            <div>
                <div class="dash-title">
                    <h2> {playingTrack ? "Simmilar to " + playingTrack.title   : ""}</h2>
                </div>
                <div class="dash-cards-small">                          
                    {Recommend.map(track => (
                        <Globaltopv2 
                            track = {track} 
                            key ={track.uri}
                            chooseTrack={choosePlaylist}
                        />
                    ))}
                </div>

            </div> 

            <div class="extra"></div>

            <div class='progress'>
                <Streaming  
                    accessToken = {accessToken}
                    trackUri = {playingTrack?.uri}  
                />
            </div>
        </div>
    )
}
