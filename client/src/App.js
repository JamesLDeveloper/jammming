import ReactDOM from 'react-dom';
//import './SearchButton/SearchButton.js';
import SearchBar from './SearchBar/SearchBar.js';
//import './Playlist/Playlist.js';
import Playlist from './Playlist/Playlist.js';
import SearchResults from './SearchResults/SearchResults.js';
import SaveToSpotify from './SaveToSpotify/SaveToSpotify.js';
import Tracklist from './Tracklist/Tracklist.js';
import styles from './App.module.css';
import SpotifyPlaylistFinder from './SpotifyPlaylistFinder/SpotifyPlaylistFinder.js';
import FoundPlaylist from './FoundPlaylist/Foundplaylist.js';
import UserPlaylists from './UserPlaylists/UserPlaylists.js';


function App() {
  return (
    <>
      <div className={styles.App}>
        <title className={styles.AppTitle}>Jammming</title>
        <div className={styles.titleAndPlaylistFinderContainer}>
            <div className={styles.siteName}>Jammming</div>
            <div className={styles.displayUserPlaylistsContainer}>
                <UserPlaylists />
            </div>
            <div className={styles.spotifyPlaylistFinderContainer}>
              <SpotifyPlaylistFinder />
            </div>
            <div className={styles.foundPlaylistContainer}>
              <FoundPlaylist playlist={["JimmyTwo Shoes", "Tommy Three Hats", "German Spider Walker"]} />
            </div>
        </div>
            
        <div className={styles.playlistSearchAndResultsContainer}>
          <div className={styles.searchBarAndButton}>
            <SearchBar />
          </div>
          <div className={styles.searchResults}>
          <SearchResults />
          </div>
        </div> 
        
        <div className={styles.playlistUpdaterContainer}>
            <Playlist />
            <Tracklist />
            <SaveToSpotify />
        </div>
      </div>
    </>
  );
}

export default App;
