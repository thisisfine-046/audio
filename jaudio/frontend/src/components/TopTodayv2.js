import React from 'react'

export default function TopTodayv2({track, chooseTrack }) {

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div 
            class="card-title"
            onClick={handlePlay}
        >
            <img src={track.albumUrl} style={{ height: "300px", width: "300px" }} />
            <div className="ml-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
                      
        </div>
    );
}
