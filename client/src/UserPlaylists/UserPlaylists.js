import React, { useState, useEffect } from 'react';
import styles from './UserPlaylists.module.css';

function UserPlaylists () {

const [userName, setUserName] = useState ("");
const [spotifyToken, setSpotifyToken] = useState("");
const [retrievedUserPlaylists, setRetrievedUserPlaylists] = useState([]);

useEffect(() => {
    fetch('/token')
    .then(res => res.json())
    .then(data => {setSpotifyToken(data.token);})
    .catch(err => {console.error('Error fetching token:', err);});
    }, []);

const handleUserInput = (e) => {
   return setUserName(e.target.value);
}

const displayUsersPlaylists = () => {

return retrievedUserPlaylists.map((playlist, index) => (
    <li key={index}>{playlist.name}</li>
)) 
};


const handleSubmit = (e) => {
    e.preventDefault();

    alert(`Searching for playlists for user ID: ${userName}`);

    fetch(`https://api.spotify.com/v1/users/${userName}/playlists`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`
            }
        }
    )
    .then(async (response) => {
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            try {
                const errorData = await response.json();
                if (errorData.error && errorData.error.message) {
                    errorMessage =`${response.status} - ${errorData.error.message}`;
                }
            } catch (err) {
                
            } 
            alert(`Spotify API error: ${errorMessage}`);
            throw new Error(errorMessage);
        }
        alert(`Bearer token accepted. Fetching playlists...`);
        return response.json();
        })

        .then((json) => {setRetrievedUserPlaylists(json.items || []);
        if(json.items && json.items.length === 0 ) {
            alert(`No playlists found for this user.`);
        } else {
            alert(`Found ${json.items.length} playlists!`);
        }
        })
        .catch((error) => console.error(`Fetch error`, error));
        };


        /*
            if (response.status === 401) {
      // Token is invalid or expired
      alert('Bearer token was rejected by Spotify. Please refresh or check your credentials.');
      throw new Error('Unauthorized: Invalid or expired token');
    } else if (response.status === 403) {
      // Token is valid but lacks permission
      alert('Bearer token was accepted, but access to this playlist is forbidden.');
      throw new Error('Forbidden: Token lacks permission');
    } else if (!response.ok) {
      // Other errors (e.g. playlist not found)
      alert('No playlists found or another error occurred.');
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      // Token accepted and playlist found
      alert('Bearer token accepted. Fetching playlist...');
      return response.json();
    }
    })
        .then(json => setRetrievedUserPlaylists(json.items))
        .catch(error => console.error(`Fetch error` ,error));

};*/


/*    useEffect (() => {
            setUsersPlaylists(["tim", "sarah"]);
        } , []);       
*/



    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className={styles.playlistFinderContainer}>
                    <div className={styles.userInputTextContainer}>
                        <label htmlFor='UserIdInput'>User Id: </label>
                        <input name='UserIdInput' id='UserIdInput' value={userName} type="text" className={styles.userIdInputContainer} onChange={handleUserInput}></input>
                    </div>
                    <div className={styles.userInputButtonContainer}>
                        <button className={styles.userInputButton}>Find my playlists</button>
                    </div>
                </div>
            </form>
            <ul>{retrievedUserPlaylists.length > 0 ? displayUsersPlaylists() : null}</ul>
        </>
    );
};

export default UserPlaylists;