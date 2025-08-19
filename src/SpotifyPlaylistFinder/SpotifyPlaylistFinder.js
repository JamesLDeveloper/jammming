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
            <div className={styles.playlistFinderContainer}>
                <div className={styles.playlistIdAndTokenId}>
                    <label htmlFor='PlaylistId'>Playlist Id: </label>
                    <input name="PlaylistId" id="PlaylistId" value={spotifyPlaylistToFind} type="text" className={styles.playlistFinderIdInput} onChange={handleUserPlaylistInput}></input>
                    <label htmlFor='TokenId'>Token Id: </label>
                    <input name="TokenId" id="TokenId" value={spotifyToken} type="text" className={styles.playlistFinderTokenInput} onChange={handleUserTokenInput}></input>
                </div>
                <div className={styles.playlistFinderButtonOnly}>
                    <button className={styles.playlistFinderButton}>Find My Playlist</button>
                </div>
            </div>
        </form>
    </>
)


}

export default SpotifyPlaylistFinder;