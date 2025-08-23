import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';
import { useFormState } from 'react-dom';
import TracklistToUpdate from '../TracklistToUpdate/TracklistToUpdate.js';
import { data } from 'browserslist';

function SpotifyPlaylistFinder ({accessToken}){

//const [spotifyPlaylistToFind, setSpotifyPlaylistToFind] = useState("");
//const [spotifyToken, setSpotifyToken] = useState("");
//const [accessToken, setAccessToken] = useState("");
const [userProfile, setUserProfile] = useState(null);
const [retrievedPlaylists, setRetrievedPlaylists] = useState([]);
const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
const [playlistObect, setPlaylistObject] = useState({});
const [trackItemsInListToUpdate, setTrackItemsInListToUpdate] = useState(["When you were young", "In the End"]);
const [trackNames, setTrackNames] = useState([]);



/*useEffect(() => {
    fetch('/token')
    .then(res => res.json())
    .then(data => {setSpotifyToken(data.token);})
    .catch(err => {console.error('Error fetching token:', err);});
    }, []);
    */

/*

useEffect (() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("access_token");

    if (tokenFromUrl) {
        setAccessToken(tokenFromUrl);
        window.history.replaceState(null, "", window.location.pathname);
    }
}, []);

useEffect(() => {
    if(!accessToken) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then((res) => res.json())
    .then((data) => setUserProfile(data))
    .then(() => fetchPlaylists())
    .catch((err) => console.error("Error fetching profile: ", err));
}, [accessToken]);

*/

useEffect (() => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((res) => res.json())
      .then((data) => setRetrievedPlaylists(data.items || []))
      .catch((err) => console.error("Error fetching playlists:", err));
})

    const selectPlaylist = (playlistId) => {
        setSelectedPlaylistId(playlistId);
        alert(`Selected Playlist = ${selectedPlaylistId}`);
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then((res) => res.json())
    .then((data) => {
       setPlaylistObject(data);
        setTrackItemsInListToUpdate(data.tracks.items || []);
        setTrackNames((data.tracks.items || []).map(item => item.track.name));
        alert(JSON.stringify(data.tracks.items, null, 2));
    })
    .catch((err) => console.error(`Error fetching playlist`, err));

    };
        


  /*const fetchPlaylists = () => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((res) => res.json())
      .then((data) => setRetrievedPlaylists(data.items || []))
      .catch((err) => console.error("Error fetching playlists:", err));
  };*/

  /*if (!accessToken) {
    return (
      <div className={styles.playlistFinderContainer}>
        <p>Please log in to Spotify first:</p>
        <a href="http://127.0.0.1:5000/login">
          <button className={styles.playlistFinderButton}>Login with Spotify</button>
        </a>
      </div>
    );
  } else*/ {

return (
<>
    <div>
        <h2>My Playlists</h2>
        <ul>
        {retrievedPlaylists.map((playlist) => (
            <li key={playlist.id} onClick={() => selectPlaylist(playlist.id)}>{playlist.name} : {playlist.id}</li>
        ))}
        </ul>

        <div className={styles.tracklistContainer}>
            <TracklistToUpdate trackNames={trackNames} accessToken={accessToken}/>
        </div>


        
    </div>
</>
);
  }
}

export default SpotifyPlaylistFinder;