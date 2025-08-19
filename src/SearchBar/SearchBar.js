import React from "react";
import './SearchBar.css';


function SearchBar(){
    return (
        <div classname="SearchBarAndButtonContainer">
        <input className="SearchTextInputBox">{}</input>
        <button className="SearchButton">Search</button>
        </div>
    );
};

export default SearchBar;