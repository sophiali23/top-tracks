import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';

import TrackList from './tracklist.js'

const Modal = ({tracks, playlistName, setPlaylistName, playlistDescription, setPlaylistDescription, setShowModal, addTracksToNewPlaylist}) => {
  return (
    <dialog className="modal" open>
      <div className="t-container">
        <label for="name">Name</label>
        <input id="name" type="text" placeholder="Playlist Name" value={playlistName} onChange={(e) => {
          setPlaylistName(e.target.value)}}/>
        <label for="desc">Description</label>
        <textarea id="desc" placeholder="Playlist description" value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)}/>
      </div>
      <div className="buttons">
        <button disabled={playlistName.length === 0} onClick={() => {
          addTracksToNewPlaylist(tracks)
        }}>Create</button>
        <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </dialog>
  )
}

function App() {
  const CLIENT_ID = "563ac9e8b72c42a2a8094f156ce2e8ac"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email"

  const [token, setToken] = useState("")
  const [timeRange, setTimeRange] = useState("medium_term");
  const [limit, setLimit] = useState(20);
  const [topTracks, setTopTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const getTopTracks = async (e) => {
    //e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: timeRange,
        limit: limit,
        offset: 0
      }
    })

    console.log('hi', data.items)
    setTopTracks(
      data.items.map((item, index) => ({
          rank: index + 1,
          id: item.id, 
          uri: item.uri, 
          name: item.name, 
          artists: item.artists.map(artist => artist.name),
          duration: item.duration_ms,
          imageUrl: item.album.images[0].url,
          previewUrl: item.preview_url,
      })));
  }

  const addTracksToNewPlaylist = async (tracks) => {
    console.log('hiz', tracks.length)
    if (tracks.length > 0) {
      console.log('hi?')
      //e.preventDefault()
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(userResponse.data)
      const playlistResponse = await axios.post("https://api.spotify.com/v1/users/" + userResponse.data.id + "/playlists", 
        {
          name: playlistName,
          description: playlistDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
      
      console.log('hi', playlistResponse)
      
      const addTracksResponse = await axios.post("https://api.spotify.com/v1/playlists/" + playlistResponse.data.id + "/tracks", 
      {
        uris: tracks.map(track => track.uri)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
  
      console.log('test', addTracksResponse)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Get your top tracks
        </h1>
        {token && <button onClick={logout}>Log out</button>}
      </header>
      {token ? <div className="content">
        <div className="filter-bar">
            <label for="limit">Limit: </label>
            <input type="number" id="limit" onChange={(e) => setLimit(e.target.value)} value={limit} min="1" max="50"/>
            <select id="time-range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="short_term">Last 4 weeks</option>
              <option value="medium_term">Last 6 months</option>
              <option value="long_term">All time</option>
            </select>
            <button disabled={limit <= 0 || limit > 50} onClick={getTopTracks}>Get Results</button>
            <button disabled={topTracks.length === 0} onClick={() => setShowModal(true)}>Create Playlist</button>
            </div>
              {topTracks.length > 0 ? <TrackList tracks={topTracks}/> : null}
              </div>
            : <div className="login-container">
                <h3 className="typewriter">Please log in to proceed</h3>
                <a className="login-link" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Log in to Spotify</a>
              </div>
              }
              {showModal ? <Modal tracks={topTracks} playlistName={playlistName} setPlaylistName={setPlaylistName} playlistDescription={playlistDescription} setPlaylistDescription={setPlaylistDescription} setShowModal={setShowModal} addTracksToNewPlaylist={addTracksToNewPlaylist}/> : null}
      <footer>
        <div>
          <a href="">GitHub</a>
          <a href="">Taylor Swift Version</a>
          <a href="https://ko-fi.com/sophia_li" target="_blank">Donate</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
