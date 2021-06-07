import React from 'react'

export default function ContentBase({track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div class="card-single" onClick={handlePlay}>
            <div class="overlayer-single" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons">favorite</i>
            </div>   
            <div className="card-small">
                <img src={track.img}  alt="" />
                <span class="content" >{track.title}</span>
                <h5>{track.artist}</h5>
            </div>   
                      
        </div>
    );
}
