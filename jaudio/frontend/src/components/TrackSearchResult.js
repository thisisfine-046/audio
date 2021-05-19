import React from 'react'

export default function TrackSearchResult({track, chooseTrack}) {

    function handlePlay() {
        chooseTrack(track)
    }
    return (
    <div>
        
    
        <div class="card-single" >
            <div class="overlayer-single" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons">favorite</i>
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
