import React from 'react';
import styles from './SongsToAdd.module.css';

function SongsToAdd({selectedTracks}){
    
    if (!selectedTracks || selectedTracks.length === 0) {
        return (
            <>
            <div>
            No Songs to add
            </div>
            </>
        )
    }

        return (
            <>
            <ul>{selectedTracks.map((track) => (
                <li key={track.uri} style={{marginBottom: 8}}>
                    <strong>{track.name} - {track.artists}</strong>
                </li>
            ) )}
            </ul>
            </>
        )
    }

export default SongsToAdd;