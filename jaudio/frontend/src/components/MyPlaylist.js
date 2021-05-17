import React from 'react'

export default function MyPlaylist({item, choosePlaylist }) {

    function handlePlay() {
        choosePlaylist(item)
    }

    return (
        <div 
            class="card-title"
            onClick={handlePlay}
        >
            <img src={item.playlistPic} style={{ height: "240px", width: "240px" }} />
            <div className="ml-3">
                <div>{item.playlistName}</div>
            </div>
                      
        </div>
    );
}
