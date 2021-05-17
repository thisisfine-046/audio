import React from 'react'

export default function Globaltopv2({track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div 
            class="card-title"
            onClick={handlePlay}
        >
            <img src={track.albumUrl} style={{ height: "100px", width: "100px" }} />
            <div className="ml-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
                      
        </div>
    );
}
