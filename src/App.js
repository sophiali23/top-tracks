import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";

import TrackList from "./components/TrackList";
import ThemeDropdown from "./components/ThemeDropdown";
import SuccessModal from "./components/SuccessModal";
import ErrorModal from "./components/ErrorModal";
import CreatePlaylistModal from "./components/CreatePlaylistModal";
import VersionRadioGroup from "./components/VersionRadioGroup";
import SettingsBar from "./components/SettingsBar";
import getTopTracks from "./utils/get-top-tracks";
import getTopTaylorTracks from "./utils/get-top-taylor-tracks";
import addTracksToNewPlaylist from "./utils/add-tracks-to-new-playlist";

const CLIENT_ID = "563ac9e8b72c42a2a8094f156ce2e8ac";
const REDIRECT_URI = "https://sophiali23.github.io/top-tracks";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];
const SCOPE = SCOPES.join(" ");

const LeftHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  margin: 16px auto 0px 16px;
  gap: 10px;
  align-self: flex-start;
  text-align: left;
`;

const Subheading = styled.h6`
  font-weight: 500;
  margin: 0px 0px 10px 0px;
`;

function App() {
  const [token, setToken] = useState("");
  const [timeRange, setTimeRange] = useState("medium_term");
  const [limit, setLimit] = useState(20);
  const [topTracks, setTopTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const version = window.localStorage.getItem("version")
    ? window.localStorage.getItem("version")
    : "original";
  const [isTaylorVersion, setIsTaylorVersion] = useState(version === "taylor");

  const currentTheme = window.localStorage.getItem("theme")
    ? window.localStorage.getItem("theme")
    : "midnights";
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setShowModal(false);
    setSuccess(false);
    setError("");
    setToken("");
    window.localStorage.removeItem("token");
  };

  const setDefault = () => {
    window.localStorage.setItem("theme", "midnights");
    setTheme("midnights");
    setTopTracks([]);
    setLimit(20);
    setTimeRange("medium_term");
    closeCreatePlaylistModal();
    setSuccess(false);
    setError("");
  };

  const updateSuccess = (success) => setSuccess(success);

  const updateError = (error) => setError(error);

  const closeCreatePlaylistModal = () => {
    setShowModal(false);
    setPlaylistName("");
    setPlaylistDescription("");
  };

  const updateShowModal = (showModal) => setShowModal(showModal);

  const handlePlaylistCreation = (error) => {
    closeCreatePlaylistModal();
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  const handlePlaylistNameChange = (e) => setPlaylistName(e.target.value);

  const handlePlaylistDescriptionChange = (e) =>
    setPlaylistDescription(e.target.value);

  const updateTopTracks = (tracks) => setTopTracks(tracks);

  const handleLimitChange = (e) => setLimit(e.target.value);

  const handleTimeRangeChange = (e) => setTimeRange(e.target.value);

  const getResults = () => {
    if (!isTaylorVersion) {
      getTopTracks(token, timeRange, limit, updateTopTracks, updateError);
    } else {
      getTopTaylorTracks(token, timeRange, updateTopTracks, updateError);
    }
  };

  const handleVersionChange = (isTaylorVersion) => {
    localStorage.setItem("version", isTaylorVersion ? "taylor" : "original");
    setIsTaylorVersion(isTaylorVersion);
    setDefault();
  };

  return (
    <div data-theme={currentTheme} className="App">
      <header>
        <div className="header-container">
          <h1>Get your top tracks</h1>
          {isTaylorVersion && <Subheading>(Taylor's Version)</Subheading>}
        </div>
        <LeftHeaderSection>
          <VersionRadioGroup
            isTaylorVersion={isTaylorVersion}
            handleVersionChange={handleVersionChange}
          />
          {isTaylorVersion && (
            <ThemeDropdown theme={theme} setTheme={setTheme} />
          )}
        </LeftHeaderSection>
        {token && <button onClick={logout}>Log out</button>}
      </header>
      {token ? (
        <div className="content">
          <SettingsBar
            showLimit={!isTaylorVersion}
            isGetResultsButtonDisabled={
              limit < 0 || limit > 50 || showModal || success || error
            }
            isCreatePlaylistButtonDisabled={
              topTracks.length === 0 || showModal || success || error
            }
            handleLimitChange={handleLimitChange}
            limit={limit}
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
            handleResults={getResults}
            updateShowModal={updateShowModal}
          />
          {topTracks.length > 0 ? <TrackList tracks={topTracks} /> : null}
        </div>
      ) : (
        <div className="login-container">
          <h3 className="typewriter">Please log in to proceed</h3>
          <a
            className="login-link"
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            Connect to Spotify
          </a>
        </div>
      )}
      {showModal && (
        <CreatePlaylistModal
          handlePlaylistCreation={handlePlaylistCreation}
          tracks={topTracks}
          playlistName={playlistName}
          handlePlaylistNameChange={handlePlaylistNameChange}
          playlistDescription={playlistDescription}
          handlePlaylistDescriptionChange={handlePlaylistDescriptionChange}
          handleClose={closeCreatePlaylistModal}
          addTracksToNewPlaylist={addTracksToNewPlaylist}
          token={token}
        />
      )}
      {success && <SuccessModal handleClose={() => updateSuccess(false)} />}
      {error && (
        <ErrorModal message={error} handleClose={() => updateError("")} />
      )}
      <footer>
        <div>
          <a href="https://github.com/sophiali23" target="_blank">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
