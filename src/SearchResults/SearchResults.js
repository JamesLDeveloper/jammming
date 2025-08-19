import React, {useState} from "react";



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
            <h1 className="SearchResultsHeading">Results containing {}</h1>
            <div className="SearchResultItems">{}</div>
        </div>
    );
};

export default SearchResults;