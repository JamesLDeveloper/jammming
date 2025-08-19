import React from "react";
import styles from './SearchBar.module.css';


function SearchBar(){
    return (
        <div classname={styles.SearchBarAndButtonContainer}>
        <input className={styles.SearchTextInputBox}>{}</input>
        <button className={styles.SearchButton}>Search</button>
        </div>
    );
};

export default SearchBar;