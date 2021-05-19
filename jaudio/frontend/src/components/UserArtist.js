import React from 'react'

export default function UserArtist({track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div class="card-circle" >
            <div class="overlayer-circle" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
            </div>   
            <img src={track.albumUrl}  alt="" />
            <span class="artist" >{track.artists}</span>    
        </div>
    );
}
