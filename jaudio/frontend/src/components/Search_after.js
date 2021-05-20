import React from 'react'

export default function Search_Afterthat({track, chooseTrack}) {

    function handlePlay() {
        chooseTrack(track)
    }
    return (
    <div>
        
    
        <div class="card-single" onClick={handlePlay}>
            <div class="overlayer-single" >
                <i class="material-icons" onClick={handlePlay}>play_circle</i>
                <i class="material-icons">favorite</i>
            </div>   
            <div className="card-small">
                <img src={track.albumUrl}  alt="" />
                <span class="content" >{track.title}</span>
                <h5>{track.artists}</h5>
            </div>   
                    
        </div>
    </div>
            


        
    )    
    
}
