import ReactDOM from 'react-dom';
//import './SearchButton/SearchButton.js';
import SearchBar from './SearchBar/SearchBar.js';
//import './Playlist/Playlist.js';
import Playlist from './Playlist/Playlist.js';
import SearchResults from './SearchResults/SearchResults.js';
import SaveToSpotify from './SaveToSpotify/SaveToSpotify.js';
import Tracklist from './Tracklist/Tracklist.js';
import styles from './App.module.css';
import SpotifyPlaylistFinder from './SpotifyPlaylistFinder/SpotifyPlaylistFinder.js';
import FoundPlaylist from './FoundPlaylist/Foundplaylist.js';
import UserPlaylists from './UserPlaylists/UserPlaylists.js';
import React, { useState , useEffect}  from 'react';

function App() {

const [accessToken, setAccessToken] = useState("");
const [userProfile, setUserProfile] = useState(null);


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
 //   .then(() => fetchPlaylists())
    .catch((err) => console.error("Error fetching profile: ", err));
}, [accessToken]);

/* useEffect(() => {
      if (accessToken) {
         toggleSpotifyPlaylistFinder();
      }
  }, [accessToken])

*/

 const loginRequired = () => {
  if (!accessToken) {
    return (
      <div className={styles.playlistFinderContainer}>
        <p>Please log in to Spotify first:</p>
        <a href="http://127.0.0.1:5000/login">
          <button className={styles.playlistFinderButton}>Login with Spotify</button>
        </a>
      </div>
    );
   }
 }

const logout = () => {

 if (accessToken) {
  return (
        <button className={styles.playlistFinderButton} 
            onClick={() => {
                localStorage.removeItem("spotify_access_token");
                setAccessToken("");
                setUserProfile(null);
            //    setRetrievedPlaylists([]);
            }}>
                Logout
        </button>
        )
 }
}

const toggleSpotifyPlaylistFinder = () => {
  if (accessToken) {
      return (
        <>
          <SpotifyPlaylistFinder accessToken={accessToken} />
        </>
      )
  }
}


  return (
    <>
      <div className={styles.App}>
        <title className={styles.AppTitle}>Jammming</title>
        <div className={styles.titleAndPlaylistFinderContainer}>
            <div className={styles.siteName}>Jammming</div>
           <div className={styles.displayUserPlaylistsContainer}>
               {/* <UserPlaylists /> */}
            </div>
          
            <div>
                {loginRequired()}
            </div>
            <div>
                {logout()}
            </div>

            <div className={styles.spotifyPlaylistFinderContainer}>
                  {toggleSpotifyPlaylistFinder()}
            </div>
        </div>
            
        <div className={styles.playlistSearchAndResultsContainer}>
          <div className={styles.searchBarAndButton}>
            <SearchBar />
          </div>
          <div className={styles.searchResults}>
          <SearchResults />
          </div>
        </div> 
        
        <div className={styles.playlistUpdaterContainer}>
            <Playlist />
            <Tracklist />
            <SaveToSpotify />
        </div>
      </div>
    </>
  );
}

export default App;
