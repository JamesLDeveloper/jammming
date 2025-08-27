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
const [playlistName, setPlaylistName] = useState("");
const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshPlaylistsTrigger, setRefreshPlaylistsTrigger] = useState(0);
const [playlists, setPlaylists] = useState([]);

useEffect (() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("access_token");

    if (tokenFromUrl) {
        setAccessToken(tokenFromUrl);
        window.history.replaceState(null, "", window.location.pathname);
    }
}, []);

const triggerRefreshPlaylists = () => setRefreshPlaylistsTrigger(prev => prev + 1);

const handleRefreshPlaylists = () => {
  setRefreshTrigger(prev => prev + 1);
}

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
                setPlaylistTracks([]);
                setSelectedPlaylistId(null);
                setPlaylistName("");
            }}>
                Logout
        </button>
        )
 }
}

  const onRefreshPlaylists = async () => {
    if (!accessToken){
      console.log("[onRefreshPlaylists] no accessToken, skipping");
      return;
    } 

    if (!selectedPlaylistId) {
      console.log("[onRefreshPlaylists] no selectedPlaylistId, skipping");
      return;
    }

    const start = performance.now();
    console.log(`[onRefreshPlaylists] fetching playlist ${selectedPlaylistId} at ${new Date().toISOString()}`);

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(selectedPlaylistId)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );


        if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") || "5", 10);
        console.warn(`[onRefreshPlaylists] rate limited, retrying after ${retryAfter}s`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        return onRefreshPlaylists();
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`[onRefreshPlaylists] spotify error ${res.status} ${res.statusText}`, text);
        return;
      }

      const json = await res.json();
      const took = (performance.now() - start).toFixed(1);
      console.log(`[onRefreshPlaylists] playlist fetched in ${took}ms -- name returned: "${json.name}"`);

      if(json.name) {
      setPlaylistName(json.name || []);
      }
      const tracks = (json.tracks?.items || []).map(item => item.track);
      setPlaylistTracks(tracks)

    } catch (err) {
      console.error("[onRefreshPlaylists] fetch failed:", err);
    }
  };

const toggleSpotifyPlaylistFinder = () => {
  if (accessToken) {
      return (
        <>
          <SpotifyPlaylistFinder
          accessToken={accessToken}
          onSelectedPlaylist={setSelectedPlaylistId}
          onTracksFetched={setPlaylistTracks}
          onPlaylistName={setPlaylistName}
          playlistName={playlistName}
          refreshTrigger={refreshTrigger}
          onRefreshPlaylists={onRefreshPlaylists}
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
            <SearchBar accessToken={accessToken} playlistId={selectedPlaylistId} selectedTracks={selectedTracks} onSelectedTracks={setSelectedTracks} playlistName={playlistName} onRefreshPlaylists={handleRefreshPlaylists}/>
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
