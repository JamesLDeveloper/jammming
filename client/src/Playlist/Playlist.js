import React from 'react';
import styles from './Playlist.module.css'

function Playlist(){
return (
    <div>
    <h1 className={styles.PlaylistCreatorHeader}>Playlist Creator</h1>
    <h2 className={styles.PlaylistCreatorSubheading}>Items to save to playlist:</h2>
    <div className={styles.PlaylistItemsToAdd}>{}</div>
    </div>
);
};

export default Playlist;