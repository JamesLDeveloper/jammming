import React, { useState, useEffect } from 'react';
import styles from './SpotifyPlaylistFinder.module.css';

function SpotifyPlaylistFinder({
  accessToken,
  onSelectedPlaylist,
  onTracksFetched,
  playlistName,
  onPlaylistName,
  refreshTrigger,
  onRefreshPlaylists
}) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  useEffect(() => {
    if (!accessToken) {
      setPlaylists([]);
      return;
    }

    const cancelledRef = { cancelled: false };

    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || 5);
          setTimeout(() => {
            if (!cancelledRef.cancelled) fetchPlaylists();
          }, retryAfter * 1000);
          return;
        }

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!cancelledRef.cancelled) setPlaylists(data.items || []);
      } catch (err) {
        if (!cancelledRef.cancelled) console.error(err);
      }
    };

    fetchPlaylists();
    return () => { cancelledRef.cancelled = true; };
  }, [accessToken, refreshTrigger]);

  useEffect(() => {
  console.log("[SpotifyPlaylistFinder] playlistName changed:", playlistName);
}, [playlistName]);


  const selectPlaylist = (playlist) => {
    const playlistId = playlist.id;
    setSelectedPlaylistId(playlistId);
    onSelectedPlaylist(playlistId);
    onPlaylistName(playlist.name);
    setRenameInput(playlist.name);

    const cancelRef = { cancelled: false };
    const fetchPlaylistDetails = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") || 5);
          setTimeout(() => { if (!cancelRef.cancelled) fetchPlaylistDetails(); }, retryAfter * 1000);
          return;
        }

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!cancelRef.cancelled) {
          const tracks = data.tracks.items.map(item => item.track);
          onTracksFetched(tracks);
        }
      } catch (err) {
        if (!cancelRef.cancelled) console.error(err);
      }
    };

    fetchPlaylistDetails();
    return () => { cancelRef.cancelled = true; };
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameInput || !selectedPlaylistId) return;

    console.log("[Rename] Starting rename request at", new Date().toISOString());
      const start = performance.now();

    try {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: renameInput }),
      });

      const afterPut = performance.now();
      console.log(`[Rename] PUT request finished in ${(afterPut - start).toFixed(2)}ms`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${res.status} ${errorText}`);
      }
        
      console.log("[Rename] Optimistically updating UI with:", renameInput);
      if (onPlaylistName) onPlaylistName(renameInput);

      



      /*if (onRefreshPlaylists) {
      const refreshStart = performance.now();
      await onRefreshPlaylists();
      const refreshEnd = performance.now();
      console.log(`[Rename] Refresh playlists took ${(refreshEnd - refreshStart).toFixed(2)}ms`);
    }*/

    setTimeout(() => {
      console.log("[Rename] Triggering delayed refresh...");
      if (onRefreshPlaylists) onRefreshPlaylists();
    }, 1200);

      const end = performance.now();
      console.log(`[Rename] Total flow took ${(end - start).toFixed(2)}ms`);
    
      alert(`Playlist renamed to ${renameInput}`);
    } catch (err) {
      console.error(err);
      alert("Failed to rename playlist.");
    }
  };

  return (
    <div>
      <h2>My Playlists</h2>
      <ul>
        {playlists.map(pl => (
          <li key={pl.id} onClick={() => selectPlaylist(pl)}>
            {pl.name}
          </li>
        ))}
      </ul>
      {selectedPlaylistId && (
        <form onSubmit={handleRenameSubmit}>
          <input type="text" value={renameInput} onChange={e => setRenameInput(e.target.value)} />
          <button>Rename Playlist</button>
        </form>
      )}
    </div>
  );
}

export default SpotifyPlaylistFinder;
