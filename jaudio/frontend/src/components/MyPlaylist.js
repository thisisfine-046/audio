import React from 'react'

export default function MyPlaylist({item, choosePlaylist2 }) {

    function handlePlay() {
        choosePlaylist2(item)
    }

    return (
        <div class="card-single" onClick={handlePlay}>
            <div class="overlayer-playlist" >

            </div>
            <div className="card-small">
                <img src={item.playlistPic} alt="" />
                <span class="content" >{item.title}</span>
                <h5  >{item.total_tracks} Tracks</h5>
            </div>          
        </div>
    );
}
