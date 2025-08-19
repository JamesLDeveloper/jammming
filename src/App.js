import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
//import './SearchButton/SearchButton.js';
import SearchBar from './SearchBar/SearchBar.js';
//import './Playlist/Playlist.js';
import Playlist from './Playlist/Playlist.js';
import SearchResults from './SearchResults/SearchResults.js';
import SaveToSpotify from './SaveToSpotify/SaveToSpotify.js';


function App() {
  return (
    <div className="App">
      <header className="App-header">

        <title className='AppTitle'>Jammming</title>

        <siteName className="SiteName">Jammming</siteName>

        { /*    <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}

        <div className="SearchBarAndButton">
          <div className="SearchBar">
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
      
      
      <playlistCreator className="playlistCreator">
      <a>        
          <Playlist />
        </a>

      <a> <SaveToSpotify /> </a>

      </playlistCreator>
    </div>
  );
}

export default App;
