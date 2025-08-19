import React, {useState} from "react";
import styles from './SearchResults.module.css';

function SearchBarInput(){
    const [searchBarInput, setSearchBarInput] = useState ("");
}


function SearchResultsArray(){
    const [searchResultsArray, setSearchResultsArray] = useState ("");

    function handleSearchResultsArrayChange (e) {
        setSearchResultsArray(e.target.value);
    }

}

function SearchResults() {

    const [searchResultsItem, setSearchResultsItem] = useState("");

    function handleSearchResultsChange (e) {
        setSearchResultsItem(e.target.value);
    }


    return (
        <div>
            <h1 className={styles.SearchResultsHeading}>Results containing {}</h1>
            <div className={styles.SearchResultItems}>{}</div>
        </div>
    );
};

export default SearchResults;