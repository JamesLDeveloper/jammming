import React, { useState, useEffect } from 'react';
import styles from './UserPlaylists.module.css';



function UserPlaylists () {

const [usersPlaylists, setUsersPlaylists] = useState (["No playlists found"]);

/*    useEffect (() => {
            setUsersPlaylists(["tim", "sarah"]);
        } , []);
*/
const displayUsersPlaylists = () => {

return usersPlaylists.map((playlist, index) => (
    <li key={index}>{playlist}</li>
)) 
};


return (
<>
 <ul>{usersPlaylists !== "" ? displayUsersPlaylists() : null}</ul>



</>
);
};

export default UserPlaylists;