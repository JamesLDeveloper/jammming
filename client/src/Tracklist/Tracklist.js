import React, {useState} from 'react';
import styles from './Tracklist.module.css';

function Tracklist(){

const [tracksInList, setTracksInList] = useState(["Mr Brightside", "Eye of the Tiger"]);


const tracksAddedToList = () => {
    return tracksInList.map((track, index) => (
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

export default Tracklist;