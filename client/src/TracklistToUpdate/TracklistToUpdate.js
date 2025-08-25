import React, {useState} from 'react';
import styles from './TracklistToUpdate.module.css';

function TracklistToUpdate({trackNames}){

const tracksAddedToList = () => {
    return trackNames.map((track, index) => (
        <li key={index}>{track}</li>
    ))
};

return (
    <>
    <div>
    <ul className={styles.test}>{tracksAddedToList()}</ul>
    </div>
    </>
)
};

export default TracklistToUpdate;