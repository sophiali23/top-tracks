import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';

import TrackList from './tracklist.js'
import ThemeDropdown from './themeDropdown.js'

const CLIENT_ID = "563ac9e8b72c42a2a8094f156ce2e8ac"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SCOPE = "user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email"

const SuccessModal = ({setSuccess}) => {
  return(
    <dialog className="modal" open>
      <h2>You have successfully created a playlist.</h2>
      <button onClick={() => setSuccess(false)}>Close</button>
    </dialog>
  )
}

const ErrorModal = ({setError, message}) => {
  const errorMessage = message.match("401") ? "Sorry! There was an error with authenticating your Spotify account. You have a bad or expired token. Please re-authenticate by logging out and logging back in." 
  : "Sorry! There was an error. Please refresh the page and try again.";
  return(
    <dialog className="modal error-modal" open>
      <h3>{`${message}`}</h3>
      <p>{errorMessage}</p>
      <button onClick={() => setError("")}>Close</button>
    </dialog>
  )
}

const Modal = ({token, tracks, playlistName, setPlaylistName, playlistDescription, setPlaylistDescription, setShowModal, addTracksToNewPlaylist, setSuccess, setError}) => {
  return (
    <dialog className="modal" open>
      <div className="t-container">
        <label for="name">Name</label>
        <input id="name" type="text" placeholder="Give your playlist a name" value={playlistName} onChange={(e) => {
          setPlaylistName(e.target.value)}}/>
        <label for="desc">Description</label>
        <textarea id="desc" placeholder="Add an optional description" value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)}/>
      </div>
      <div className="buttons">
        <button disabled={playlistName.length === 0} onClick={() => {
          addTracksToNewPlaylist(token, tracks, playlistName, playlistDescription).then(result => {
              setShowModal(false);
              setSuccess(true)
              setPlaylistName("")
              setPlaylistDescription("")
          }).catch(err => {
            setShowModal(false);
            setError(err.message);
            setPlaylistName("")
            setPlaylistDescription("")
          })}}>Create</button>
        <button className="cancel" onClick={() => {
          setShowModal(false)
          setPlaylistName("")
          setPlaylistDescription("")
        }}>Cancel</button>
      </div>
    </dialog>
  )
}

const addTracksToNewPlaylist = async (token, tracks, playlistName, playlistDescription) => {
  if (tracks.length > 0) {
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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
    const addTracksResponse = await axios.post("https://api.spotify.com/v1/playlists/" + playlistResponse.data.id + "/tracks", 
    {
      uris: tracks.map(track => track.uri)
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    return addTracksResponse
  }
}

const getTopTracks = async (token, timeRange, limit, setTopTracks, setError) => {
  await axios.get("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      time_range: timeRange,
      limit: limit,
      offset: 0
    }
  }).then(result => {
    setTopTracks(
      result.data.items.map((item, index) => ({
          rank: index + 1,
          id: item.id, 
          uri: item.uri, 
          name: item.name, 
          artists: item.artists.map(artist => artist.name),
          duration: item.duration_ms,
          imageUrl: item.album.images[0].url,
          previewUrl: item.preview_url,
      })));
  }).catch(err => {
    setError(err.message);
  })
}

const getTopTaylorTracks = async (token, timeRange, setTopTracks, setError) => {
  await axios.get("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      time_range: timeRange,
      limit: 50,
      offset: 0
    }
  }).then(result => {
    console.log(result);
    setTopTracks(
      result.data.items.filter(item => 
        item.artists.map(artist => artist.name).includes("Taylor Swift")
      ).map((item, index) => ({
          rank: index + 1,
          id: item.id, 
          uri: item.uri, 
          name: item.name, 
          artists: item.artists.map(artist => artist.name),
          duration: item.duration_ms,
          imageUrl: item.album.images[0].url,
          previewUrl: item.preview_url,
      })));
  }).catch(err => {
    setError(err.message);
  })
}

function App() {
  const [token, setToken] = useState("")
  const [timeRange, setTimeRange] = useState("medium_term");
  const [limit, setLimit] = useState(20);
  const [topTracks, setTopTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const version = localStorage.getItem('version') ? localStorage.getItem('version') : 'original';
  const[isTaylorVersion, setIsTaylorVersion] = useState(version === 'taylor');

  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : "midnights";
  const [theme, setTheme] = useState(currentTheme);

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
    setShowModal(false);
    setSuccess(false)
    setError("")
    setToken("")
    window.localStorage.removeItem("token")
  }

  const reset = () => {
    localStorage.setItem('theme', 'midnights');
    setTheme("midnights");
    setTopTracks([]);
    setLimit(20);
    setTimeRange("medium_term");
    setShowModal(false);
    setPlaylistName("");
    setPlaylistDescription("");
    setSuccess(false);
    setError("");
  }

  return (
    <div data-theme={currentTheme} className="App">
      <header className="App-header">
        {isTaylorVersion && <ThemeDropdown theme={theme} setTheme={setTheme}/>}
        <div className="header-container">
          <h1>Get your top tracks</h1>
          {isTaylorVersion && <h6>(Taylor's Version)</h6>}
        </div>
        {token && <button onClick={logout}>Log out</button>}
      </header>
      {token ? <div className="content">
        <div className="filter-bar">
            {!isTaylorVersion && <label className="limit" for="limit">Limit: </label>}
            {!isTaylorVersion && <input type="number" id="limit" onChange={(e) => setLimit(e.target.value)} value={limit} min="0" max="50"/>}
            <select id="time-range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="short_term">Last 4 weeks</option>
              <option value="medium_term">Last 6 months</option>
              <option value="long_term">All time</option>
            </select>
            <button disabled={limit < 0 || limit > 50 || showModal || success || error} onClick={() => {
              if (!isTaylorVersion) {
                getTopTracks(token, timeRange, limit, setTopTracks, setError)
              } else {
                getTopTaylorTracks(token, timeRange, setTopTracks, setError)
              }
            }}>Get Results</button>
            <button disabled={topTracks.length === 0 || showModal || success || error} onClick={() => setShowModal(true)}>Create Playlist</button>
            </div>
              {topTracks.length > 0 ? <TrackList tracks={topTracks}/> : null}
              </div>
            : <div className="login-container">
                <h3 className="typewriter">Please log in to proceed</h3>
                <a className="login-link" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Connect to Spotify</a>
              </div>
              }
              {showModal && <Modal setError={setError} setSuccess={setSuccess} tracks={topTracks} playlistName={playlistName} setPlaylistName={setPlaylistName} playlistDescription={playlistDescription} setPlaylistDescription={setPlaylistDescription} setShowModal={setShowModal} addTracksToNewPlaylist={addTracksToNewPlaylist} token={token}/>}
              {success && <SuccessModal setSuccess={setSuccess}/>}
              {error && <ErrorModal message={error} setError={setError}/>}
      <footer>
        <div>
          <a href="https://github.com/sophiali23" target="_blank">GitHub</a>
          <a onClick={() => {
            localStorage.setItem('version', isTaylorVersion ? 'original' : 'taylor');
            setIsTaylorVersion(!isTaylorVersion)
            reset();
          }
          }>{isTaylorVersion ? "Original Version" : "Taylor Swift Version"}</a>
          <a href="https://ko-fi.com/sophia_li" target="_blank">Donate</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
