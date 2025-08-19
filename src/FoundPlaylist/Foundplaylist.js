//import React, {useState, useEffect} from 'react';

function FoundPlaylist ({playlist}){

const foundPlaylist = () => {
    return playlist.map((track, index) => (
        <li key={index}>{track}</li>
    ))
};


return (
    <>
        <ul>{foundPlaylist()}</ul>
    </>
)

}

export default FoundPlaylist;