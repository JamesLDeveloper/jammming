import React from 'react';
import './Playlist.modules.css'

function Playlist(){
return (
    <div>
    <h1 className="PlaylistCreatorHeader" 
    >Playlist Creator</h1>
    <h2 className="PlaylistCreatorSubheading">Items to save to playlist:</h2>
    <div className="PlaylistItemsToAdd">{}</div>
    </div>
);
};

export default Playlist;