import React from 'react'

export default function TrackSearchResult({track, chooseTrack ,saveChooseTrack}) {

    function handlePlay() {
        chooseTrack(track)
    }
    function saveTrack() {
        saveChooseTrack(track)
    }
    return (
    <div>
        
    
        <div class="card-single" onClick={handlePlay}>
            <div class="overlayer-single" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons" onClick={saveTrack}>favorite</i>
            </div>   
            <div className="card-small">
                <img src={track.albumUrl}  alt="" />
                <span class="content" >{track.title}</span>
                <h5>{track.artist}</h5>    
            </div>   
                    
        </div>
    </div>
            


        
    )    
    
}
