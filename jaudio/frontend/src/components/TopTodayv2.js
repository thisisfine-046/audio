import React from 'react'

export default function TopTodayv2({track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div class="card-title" >
            <div class="overlayer">
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons">favorite</i>
            </div>   
            <div className="card">
                <img src={track.albumUrl}  alt="" />
                <span class="content" >{track.title}</span>
                <h4>{track.artists}</h4>
            </div>    
            
        </div>
    );
}
