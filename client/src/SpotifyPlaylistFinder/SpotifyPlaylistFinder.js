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
    if (!selectedPlaylistId) return;

    try {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: renameInput }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      onPlaylistName(renameInput);
      if (onRefreshPlaylists) onRefreshPlaylists();
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
