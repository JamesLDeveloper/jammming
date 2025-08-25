import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';
import { useFormState } from 'react-dom';
import TracklistToUpdate from '../TracklistToUpdate/TracklistToUpdate.js';
import { data } from 'browserslist';

function SpotifyPlaylistFinder ({accessToken, onSelectPlaylist}){

console.log("SpotifyPlaylistFinder received accessToken:", accessToken);

const [userProfile, setUserProfile] = useState(null);
const [retrievedPlaylists, setRetrievedPlaylists] = useState([]);
const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
const [playlistObect, setPlaylistObject] = useState({});
const [trackItemsInListToUpdate, setTrackItemsInListToUpdate] = useState(["When you were young", "In the End"]);
const [trackNames, setTrackNames] = useState([]);

useEffect(() => {
  console.log("SpotifyPlaylistFinder mounted");
  return () => console.log("SpotifyPlaylistFinder unmounted");
}, []);




const fetchPlaylists = (cancelledRef) => {
  fetch(`https://api.spotify.com/v1/me/playlists`, {
    headers: {Authorization : `Bearer ${accessToken}`},
  })
  .then (async (res) => {
    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After") || 5;
      console.warn(`Rate limited. Retrying after ${retryAfter}s`);
      setTimeout (() => {
        if (!cancelledRef.cancelled) fetchPlaylists(cancelledRef);
      }, retryAfter * 1000);
      return null;
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }) 
  .then((data) => {
    if (data) {
      console.log("Fetched playlists", data);
      setRetrievedPlaylists(data.items || []);
    }
  })
  .catch((err) => {
    if (!cancelledRef.cancelled) {
    console.error("Error fetching playlists:", err);
    }
  });
  }

useEffect(() => {
  if (!accessToken) {
    setRetrievedPlaylists([]);  // clear playlists on logout
    return;
  }
  const cancelledRef = { cancelled : false };
  const timer = setTimeout(() => fetchPlaylists(cancelledRef), 500);
  return () => {
    cancelledRef.cancelled = true;
    clearTimeout(timer);
  };
  }, [accessToken]);


    const selectPlaylist = (playlistId) => {
        setSelectedPlaylistId(playlistId);
        onSelectPlaylist(playlistId);
        console.log(`Selected Playlist = ${playlistId}`);

      const fetchPlaylistDetails = () => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },

      })
      .then(async (res) => {
        if(res.status === 429) {
          const retryAfter = res.headers.get("Retry-After") || 5;
          console.warn(`Rate limited (playlist fectch). Retrying after ${retryAfter}s`);
            setTimeout(fetchPlaylistDetails, retryAfter * 1000);
            return null;
        }
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();

      })
    .then((data) => {
      if (data) {
       setPlaylistObject(data);
        setTrackItemsInListToUpdate(data.tracks.items || []);
        setTrackNames((data.tracks.items || []).map(item => item.track.name));
        console.log(JSON.stringify(data.tracks.items, null, 2));
      }
    })
    .catch((err) => console.error(`Error fetching playlist`, err));
    };
    fetchPlaylistDetails();
  };

      const handlePlaylistInfo = () => {
      console.log(`Your playlists ${JSON.stringify(retrievedPlaylists, null, 2)}`);
      };

{

return (
<>
    <div>
        <h2 onClick={handlePlaylistInfo}>My Playlists</h2>
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