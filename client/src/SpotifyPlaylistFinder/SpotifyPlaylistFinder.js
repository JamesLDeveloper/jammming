import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';

function SpotifyPlaylistFinder (){

const [spotifyPlaylistToFind, setSpotifyPlaylistToFind] = useState("");
const [spotifyToken, setSpotifyToken] = useState("");
const [retrievedPlaylist, setRetrievedPlaylist] = useState([]);

useEffect(() => {
    fetch('/token')
    .then(res => res.json())
    .then(data => {setSpotifyToken(data.token);})
    .catch(err => {console.error('Error fetching token:', err);});
    }, []);

const handleUserPlaylistInput = (e) => {
    return setSpotifyPlaylistToFind(e.target.value);
}

/*const handleUserTokenInput = (e) => {
    return setSpotifyToken(e.target.value);
}*/

const handleSubmit = (e) => {
e.preventDefault();

alert(`Searching for Spotify Playlist Id: ${spotifyPlaylistToFind}`);

fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylistToFind}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`
            }
        }
        )
        .then(response => {
    if (response.status === 401) {
      // Token is invalid or expired
      alert('Bearer token was rejected by Spotify. Please refresh or check your credentials.');
      throw new Error('Unauthorized: Invalid or expired token');
    } else if (response.status === 403) {
      // Token is valid but lacks permission
      alert('Bearer token was accepted, but access to this playlist is forbidden.');
      throw new Error('Forbidden: Token lacks permission');
    } else if (!response.ok) {
      // Other errors (e.g. playlist not found)
      alert('No playlist found or another error occurred.');
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      // Token accepted and playlist found
      alert('Bearer token accepted. Fetching playlist...');
      return response.json();
    }
  })
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
                   {/* <label htmlFor='TokenId'>Token Id: </label>
                    <input name="TokenId" id="TokenId" value={spotifyToken} type="text" className={styles.playlistFinderTokenInput} onChange={handleUserTokenInput}></input>*/ }
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