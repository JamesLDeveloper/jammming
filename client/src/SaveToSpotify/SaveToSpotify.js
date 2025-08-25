import React from 'react';
import styles from './SaveToSpotify.module.css';
import { urlAlphabet } from 'nanoid';

function SaveToSpotify({accessToken, playlistId, selectedTracks}){


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playlistId) {
        alert("No playlist selected");
        return;
    }
    
    if(!selectedTracks || selectedTracks.length === 0) {
        alert("No tracks selected");
        return;
    }

    try {
        const uris = selectedTracks.map((t) => t.uri);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: { 
            Authorization : `Bearer ${accessToken}`,
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({uris}),
    });

    if(!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Tracks added successfully:", data);
    alert("Tracks added to playlist");

    } catch (err) {
        console.error("Error saving to Spotify:", err);
        alert("Failed to add tracks to playlist. Check console for details.");
    }
};

    return (
        <>
        <button onClick={handleSubmit} className={styles.SavePlaylistToSpotify}>Save to Spotify</button>        
        </>
    );
};

export default SaveToSpotify;