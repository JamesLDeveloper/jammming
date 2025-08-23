import React, {useState, useEffect} from "react";
import styles from './SearchResults.module.css';



/*

function SearchBarInput({searchResults}){
   
const [searchBarInput, setSearchBarInput] = useState ("");
}

function SearchResultsArray(){
    const [searchResultsArray, setSearchResultsArray] = useState ("");

    function handleSearchResultsArrayChange (e) {
        setSearchResultsArray(e.target.value);
    }

}

*/

function SearchResults({searchBarUserInput, searchResults}) {

const [items, setItems] = useState();

/*    function handleSearchResultsChange (e) {
        setSearchResultsItem(e.target.value);
    } */

/*const artistsAndSongs = () => {
    const tracksArray = searchResults.tracks.items
   return tracksArray.map((song, artists) => (

            <li key={artists}>{song} : {artists}</li>

    ))
};*/

/*const tracksAddedToList = () => {
    return trackNames.map((track, index) => (
        <li key={index}>{track}</li>
    ))
};
*/

/*    useEffect(() => {

        setItems(searchResults.tracks);
        console.log(items);
        return items
    }, [searchResults]);


*/






    return (
        <div>
            <h1 className={styles.SearchResultsHeading}>Results containing {searchBarUserInput}</h1>
            <ul className={styles.SearchResultItems}>
                <li>{items}</li></ul>
        </div>
    );
};

export default SearchResults;