import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';
import { useFormState } from 'react-dom';

function SpotifyPlaylistFinder (){

//const [spotifyPlaylistToFind, setSpotifyPlaylistToFind] = useState("");
//const [spotifyToken, setSpotifyToken] = useState("");
const [accessToken, setAccessToken] = useState("");
const [userProfile, setUserProfile] = useState(null);
const [retrievedPlaylists, setRetrievedPlaylists] = useState([]);

/*useEffect(() => {
    fetch('/token')
    .then(res => res.json())
    .then(data => {setSpotifyToken(data.token);})
    .catch(err => {console.error('Error fetching token:', err);});
    }, []);
    */

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

  const fetchPlaylists = () => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((res) => res.json())
      .then((data) => setRetrievedPlaylists(data.items || []))
      .catch((err) => console.error("Error fetching playlists:", err));
  };

  if (!accessToken) {
    return (
      <div className={styles.playlistFinderContainer}>
        <p>Please log in to Spotify first:</p>
        <a href="http://127.0.0.1:5000/login">
          <button className={styles.playlistFinderButton}>Login with Spotify</button>
        </a>
      </div>
    );
  } else {

return (
<>
    <div>
        <h2>My Playlists</h2>
        <ul>
        {retrievedPlaylists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
        ))}
        </ul>
    </div>
</>
);
  }
}

export default SpotifyPlaylistFinder;