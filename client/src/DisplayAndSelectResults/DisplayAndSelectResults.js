import React, {useState, useEffect, use} from "react";
import styles from './DisplayAndSelectResults.module.css';
import SaveToSpotify from "../SaveToSpotify/SaveToSpotify.js";
import SongsToAdd from "../SongsToAdd/SongsToAdd.js";
import { select } from "underscore";

function DisplayAndSelectResults({searchResults, playlistId, onSelectedTracks}) {

 const [selected, setSelected] = useState([]);

if (!searchResults || !searchResults.tracks) return <div>Please enter a valid song name</div>;

const tracks = (searchResults?.tracks?.items || []).map((t) => ({
    id: t.id,
    name: t.name || "<unknown>",
    artists: (t.artists || []).map((a) => a.name).join(", "),
    uri: t.uri,
}));

const toggleSelect = (track) => {
    setSelected((prev) => {
        const exists = prev.some((t) => t.uri === track.uri);
        const updated = exists ? prev.filter((t) => t.uri !== track.uri)
       : [...prev, track]; 
        onSelectedTracks(updated);
        return updated;
    });
};

    return (
        <div>
            <h1 className={styles.SearchResultsHeading}>Search Results {playlistId ? `for Playlist ${playlistId}` : ""}</h1>
            <ul className={styles.SearchResultItems}>
                {tracks.map((track) => (
                    <li key={track.uri} style={{ marginBotton: 8 }}>
                        <strong>{track.name}</strong> - <em>{track.artists}</em>
                        <button onClick={() => toggleSelect(track)}
                            style={{ marginLeft: 8 }}
                            aria-pressed={selected.some((t) => t.uri === track.uri)}
                            >
                                {selected.some((t) => t.uri === track.uri) ? "Remove" : "Add"}
                        </button>
                    </li>
                ))}
                </ul>
                <div>
                <strong>Selected: </strong> {selected.length}
                </div>
        </div>
    );
};

export default DisplayAndSelectResults;