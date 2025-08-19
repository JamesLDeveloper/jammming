import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';

function SpotifyPlaylistFinder (){

const [spotifyPlaylistToFind, setSpotifyPlaylistToFind] = useState("");
const [spotifyToken, setSpotifyToken] = useState("");
const [retrievedPlaylist, setRetrievedPlaylist] = useState([]);

const handleUserPlaylistInput = (e) => {
    return setSpotifyPlaylistToFind(e.target.value);
}

const handleUserTokenInput = (e) => {
    return setSpotifyToken(e.target.value);
}

const handleSubmit = () => {
alert(`Searching for Spotify Playlist Id: ${spotifyPlaylistToFind}`);

fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylistToFind}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`
            }
        }
        )
        .then(response => {
            if(!response.ok) {
                alert(`no playlist found`);
                throw new Error(`HTTP error! status: ${response.error}`);
            } return response.json()
        } )
        .then(json => setRetrievedPlaylist(json))
        .catch(error => console.error(`Fetch error` ,error));
};


return (
    <>
        <form onSubmit={handleSubmit}>
        <div classname={styles.playlistFinderContainer}>

            <div className={styles.playlistIdAndTokenId}>
                <div>Playlist Id</div>
                <input value={spotifyPlaylistToFind} type="text" className={styles.playlistFinderIdInput} onChange={handleUserPlaylistInput}></input>
                <div>Token Id</div>
                <input value={spotifyToken} type="text" className={styles.playlistFinderTokenInput} onChange={handleUserTokenInput}></input>
            </div>
             <button className={styles.playlistFinderButton}>Find My Playlist</button>
        </div>
        </form>
    </>
)


}

export default SpotifyPlaylistFinder;