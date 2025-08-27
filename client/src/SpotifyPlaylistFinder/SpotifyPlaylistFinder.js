import React, {useState, useEffect} from 'react';
import styles from './SpotifyPlaylistFinder.module.css';
import { useFormState } from 'react-dom';
import TracklistToUpdate from '../TracklistToUpdate/TracklistToUpdate.js';
import { data } from 'browserslist';

function SpotifyPlaylistFinder ({accessToken, onSelectedPlaylist, onTracksFetched, playlistName, onPlaylistName, refreshTrigger, onRefreshPlaylists}) {

console.log("SpotifyPlaylistFinder received accessToken:", accessToken);

const [renamePlaylistUserInput, setRenamePlaylistUserInput] = useState("");

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

const handleSubmit = async (e) => {
    e.preventDefault();

    const newName = renamePlaylistUserInput;

    try {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${onSelectedPlaylist.id}`, {
        method: "PUT",
        headers: { 
            Authorization : `Bearer ${accessToken}`,
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({ name: newName }),
    });
            if(!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    onPlaylistName(newName);

    if (onRefreshPlaylists) onRefreshPlaylists();

    console.log(`Playlist successfully renamed to ${newName}`);

    } catch (err) {
        console.error("Error saving new name to Spotify:", err);
        alert("Failed to add tracks to playlist. Check console for details.");
    }
};

const handleUserInput = (e) => {
    setRenamePlaylistUserInput(e.target.value);
}


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
  }, [accessToken, refreshTrigger]);


    const selectPlaylist = (playlist) => {
        const playlistId=playlist.id;
        onSelectedPlaylist(playlistId);
        onPlaylistName(playlist.name);
        console.log(`Selected Playlist = ${playlistId}`);

        const cancelRef = {cancelled : false};

      const fetchPlaylistDetails = () => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },

      })
      .then(async (res) => {
        if(res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || 5);
          console.warn(`Rate limited (playlist fectch). Retrying after ${retryAfter}s`);
            setTimeout(() => {
              if (!cancelRef.cancelled) fetchPlaylistDetails()
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
      if (data && !cancelRef.cancelled) {
        const tracks = data.tracks.items.map(item => item.track);
        onTracksFetched(tracks);
      }
    })

    .catch((err) => {if (!cancelRef.cancelled) console.error(`Error fetching playlist`, err); });
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
          <>
            <li key={pl.id} onClick={() => selectPlaylist(pl)}>{pl.name}</li>
            <li><h1>Rename Playlist: {playlistName}</h1>
            <form onSubmit={handleSubmit}>
                <input value={renamePlaylistUserInput} type="text" onChange={handleUserInput}></input>
                <button>Rename playlist</button>
            </form>
            </li>
            </>
        ))}
        </ul>
    </div>
</>
);
  }


export default SpotifyPlaylistFinder;