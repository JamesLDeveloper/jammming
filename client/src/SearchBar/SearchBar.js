import React, { useEffect, useState } from "react";
import styles from './SearchBar.module.css';
import DisplayAndSelectResults from "../DisplayAndSelectResults/DisplayAndSelectResults";
import SongsToAdd from "../SongsToAdd/SongsToAdd";

function SearchBar({accessToken, playlistId, onSelectedTracks}){

    const [searchBarUserInput, setSearchBarUserInput] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [selectedTracks, setSelectedTracks] = useState([]);

useEffect(() => {
  if (onSelectedTracks) onSelectedTracks(selectedTracks);
}, [selectedTracks]);

    const handleUserInput = (e) => {
        setSearchBarUserInput(e.target.value);    
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Searching for ${searchBarUserInput}`);

        fetch(`https://api.spotify.com/v1/search/?q=track:${encodeURIComponent(searchBarUserInput)}&type=track&limit=10&offset=0`, {
            headers: {Authorization : `Bearer ${accessToken}`},
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            } return response.json()
        } )
        .then((json) => {
            setSearchResults(json);
            console.log("Search results:", json);
        })
        .catch(error => console.error(`Fetch error` ,error));
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
        <div className={styles.SearchBarAndButtonContainer}>
        <input value={searchBarUserInput} type="text" className={styles.SearchTextInputBox} onChange={handleUserInput}></input>
        <button className={styles.SearchButton}>Search</button>
        </div>
        </form>
                  <div className={styles.searchResults}>
          <DisplayAndSelectResults accessToken={accessToken} searchResults={searchResults} playlistID={playlistId} onSelectTracks={setSelectedTracks}/>
          </div>
          </>
    );
};

export default SearchBar;