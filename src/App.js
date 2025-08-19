import logo from './logo.svg';
import ReactDOM from 'react-dom';
//import './SearchButton/SearchButton.js';
import SearchBar from './SearchBar/SearchBar.js';
//import './Playlist/Playlist.js';
import Playlist from './Playlist/Playlist.js';
import SearchResults from './SearchResults/SearchResults.js';
import SaveToSpotify from './SaveToSpotify/SaveToSpotify.js';
import Tracklist from './Tracklist/Tracklist.js';
import styles from './App.module.css';


function App() {
  return (
    <div className={styles.App}>
      <header className={styles.App-logo}>

        <title className={styles.AppTitle}>Jammming</title>

        <siteName className={styles.SiteName}>Jammming</siteName>

        { /*    <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}

        <div className={styles.SearchBarAndButton}>
          <div className={styles.SearchBar}>
            <SearchBar />
          </div>
        </div>

        <div>
          <SearchResults />
        </div>

{/*}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
*/}



      </header>
      
      
      <playlistCreator className={styles.playlistCreator}>
      <a>        
          <Playlist />
        </a>

     <div> <Tracklist /> </div> 

      <a> <SaveToSpotify /> </a>

      </playlistCreator>
    </div>
  );
}

export default App;
