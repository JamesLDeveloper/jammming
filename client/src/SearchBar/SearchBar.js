import React, { useEffect, useState } from "react";
import styles from './SearchBar.module.css';
import Tracklist from "../Tracklist/Tracklist";


function SearchBar(){


    const [searchBarUserInput, setSearchBarUserInput] = useState("");
    const [searchResults, setSearchResults] = useState("");

    const [retrievedPlaylist, setRetrievedPlaylist] = useState([]);

    const playlist_id = "3845658339"
    const token = "asklfalgfakljfgal;sdkaSDLK;"

    useEffect(() => {
        fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.error}`);
            } return response.json()
        } )
        .then(json => setRetrievedPlaylist(json))
        .catch(error => console.error(`Fetch error` ,error));
    }, [playlist_id]);

    const handleUserInput = (e) => {
        setSearchBarUserInput(e.target.value);    
    };

    const handleSubmit = (e) => {
        return alert(`Searching for ${searchBarUserInput}`);
    }

    return (
        <form onSubmit={handleSubmit}>
        <div classname={styles.SearchBarAndButtonContainer}>
        <input value={searchBarUserInput} type="text" className={styles.SearchTextInputBox} onChange={handleUserInput}></input>
        <button className={styles.SearchButton}>Search</button>
        </div>
        </form>
    );
};

export default SearchBar;