import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';
import { useFormState } from 'react-dom';
import TracklistToUpdate from '../TracklistToUpdate/TracklistToUpdate.js';
import { data } from 'browserslist';

function SpotifyPlaylistFinder ({accessToken, onSelectedPlaylist, onTracksFetched}) {

console.log("SpotifyPlaylistFinder received accessToken:", accessToken);

const [userProfile, setUserProfile] = useState(null);
//const [retrievedPlaylists, setRetrievedPlaylists] = useState([]);
//const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
//const [playlistObect, setPlaylistObject] = useState({});
//onst [trackItemsInListToUpdate, setTrackItemsInListToUpdate] = useState(["When you were young", "In the End"]);
//const [trackNames, setTrackNames] = useState([]);

const [playlists, setPlaylists] = useState([]);

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
      const retryAfter = parseInt(res.headers.get("Retry-After") || 5);
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
    if (data && !cancelledRef.cancelled) {
      setPlaylists(data.items || []);
      console.log("Fetched playlists", data);
     
  }
})
  .catch((err) => {
    if (!cancelledRef.cancelled) {
    console.error("Error fetching playlists:", err);
    }
  });
  };

useEffect(() => {
  if (!accessToken) {
    setPlaylists([]);  // clear playlists on logout
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
        onSelectedPlaylist(playlistId);
        console.log(`Selected Playlist = ${playlistId}`);

      const fetchPlaylistDetails = (cancelledRef) => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },

      })
      .then(async (res) => {
        if(res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || 5);
          console.warn(`Rate limited (playlist fectch). Retrying after ${retryAfter}s`);
            setTimeout(() => {
              if (!cancelledRef.cancelled) fetchPlaylistDetails(cancelledRef)
            }, retryAfter * 1000);
            return null;
        }
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();

      })
    /*.then((data) => {
      if (data) {
       setPlaylistObject(data);
        setTrackItemsInListToUpdate(data.tracks.items || []);
        setTrackNames((data.tracks.items || []).map(item => item.track.name));
        const existingTrackUris = data.tracks.items.map(item => item.track.uri);
        if(onExistingTracksChange) onExistingTracksChange(existingTrackUris);
        console.log(JSON.stringify(data.tracks.items, null, 2));
      }
    })*/
    .then(data => {
      if (data && !cancelledRef.cancelled) {
        const tracks = data.tracks.items.map(item => item.track);
        onTracksFetched(tracks);
      }
    })

    .catch((err) => {if (!cancelledRef.cancelled) console.error(`Error fetching playlist`, err); });
    };
    fetchPlaylistDetails();
  };

      const handlePlaylistInfo = () => {
      console.log(`Your playlists ${JSON.stringify(playlists, null, 2)}`);
      };


return (
<>
    <div>
        <h2 onClick={handlePlaylistInfo}>My Playlists</h2>
        <ul>
        {playlists.map((pl) => (
            <li key={pl.id} onClick={() => selectPlaylist(pl.id)}>{pl.name} : {pl.id}</li>
        ))}
        </ul>
    </div>
</>
);
  }


export default SpotifyPlaylistFinder;