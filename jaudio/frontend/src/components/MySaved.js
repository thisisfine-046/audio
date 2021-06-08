import React from 'react'

export default function MySaved({track, chooseTrack ,RemoveChooseTrack}) {

    function handlePlay() {
        chooseTrack(track)
    }
    function RemoveSave() {
        RemoveChooseTrack(track)
    }

    return (
        <div class="card-single" onClick={handlePlay}>
            <div class="overlayer-single" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons" onClick={RemoveSave}>favorite</i>
            </div>   
            <div className="card-small">
                <img src={track.albumUrl}  alt="" />
                <span class="content" >{track.title}</span>
                <h5>{track.artists}</h5>
            </div>   
                      
        </div>
    );
}
