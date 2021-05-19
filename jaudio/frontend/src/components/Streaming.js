import React, { useEffect, useState } from 'react';
import SpotifyPlayer from "react-spotify-web-playback"



export default function Streaming({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false)
    useEffect(() => setPlay(true), [trackUri])



    if(!accessToken) return null
    return (
        <SpotifyPlayer
            token={accessToken}
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play = {play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                bgColor: '#1f1f1f',
                color: '#fff',
                height:55,
                play: true,
                sliderColor: '#1cb954',
                trackArtistColor: '#b3b3b3',
                trackNameColor: '#fff',
                sliderColor: '#fa2d48',
                sliderHandleColor:'#fff',
                sliderTrackColor:"hsla(0,0%,100%,.1)",
                loaderColor: '#ccc',
              }}
        />
    )
}
