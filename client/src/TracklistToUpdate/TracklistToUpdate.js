import React, {useState} from 'react';
import styles from './TracklistToUpdate.module.css';

function TracklistToUpdate({trackNames}){

if (!trackNames || trackNames.length === 0) {
    return <div>No tracks in this playlist</div>;
}

/*const tracksAddedToList = () => {
    return trackNames.map((track, index) => (
        <li key={index}>{track}</li>
    ))
};
*/

return (
    <>
    <div>
    <ul className={styles.test}>{trackNames.map((track, index) => (
        <li key={index}>{track}</li>
    ))}</ul>
    </div>
    </>
)
};

export default TracklistToUpdate;