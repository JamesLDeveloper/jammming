import ReactDOM from 'react-dom';
//import './SearchButton/SearchButton.js';
import SearchBar from './SearchBar/SearchBar.js';
//import './Playlist/Playlist.js';
import Playlist from './Playlist/Playlist.js';
import DisplayAndSelectResults from './DisplayAndSelectResults/DisplayAndSelectResults.js';
import SaveToSpotify from './SaveToSpotify/SaveToSpotify.js';
import Tracklist from './Tracklist/Tracklist.js';
import styles from './App.module.css';
import SpotifyPlaylistFinder from './SpotifyPlaylistFinder/SpotifyPlaylistFinder.js';
import SongsToAdd from './SongsToAdd/SongsToAdd.js';
import FoundPlaylist from './FoundPlaylist/Foundplaylist.js';
import UserPlaylists from './UserPlaylists/UserPlaylists.js';
import React, { useState , useEffect}  from 'react';
import TracklistToUpdate from './TracklistToUpdate/TracklistToUpdate.js';

function App() {

const [accessToken, setAccessToken] = useState("");
const [userProfile, setUserProfile] = useState(null);
const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
const [playlistTracks, setPlaylistTracks] = useState([]);
const [selectedTracks, setSelectedTracks] = useState([]);

useEffect (() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("access_token");

    if (tokenFromUrl) {
        setAccessToken(tokenFromUrl);
        window.history.replaceState(null, "", window.location.pathname);
    }
}, []);

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
          <SpotifyPlaylistFinder
          accessToken={accessToken}
          onSelectedPlaylist={setSelectedPlaylistId}
          onTracksFetched={setPlaylistTracks}
          />

          <TracklistToUpdate trackNames={playlistTracks.map(track => track.name)} />
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
            <SearchBar accessToken={accessToken} playlistId={selectedPlaylistId} selectedTracks={selectedTracks} onSelectedTracks={setSelectedTracks}/>
          </div>

        </div> 
        
        <div className={styles.playlistUpdaterContainer}>
            <Playlist />
            <SongsToAdd selectedTracks={selectedTracks} onRemoveTrack={(uri) => setSelectedTracks(prev => prev.filter(t => t.uri !== uri))}/>
            <SaveToSpotify accessToken={accessToken} playlistId={selectedPlaylistId} selectedTracks={selectedTracks} existingTracks={playlistTracks.map(t => t.uri)} onTracksUpdated={setPlaylistTracks}/>
        </div>
      </div>
    </>
  );
}

export default App;
