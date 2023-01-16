import axios from "axios";

const addTracksToNewPlaylist = async (
    token,
    tracks,
    playlistName,
    playlistDescription
  ) => {
    if (tracks.length > 0) {
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const playlistResponse = await axios.post(
        "https://api.spotify.com/v1/users/" + userResponse.data.id + "/playlists",
        {
          name: playlistName,
          description: playlistDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const addTracksResponse = await axios.post(
        "https://api.spotify.com/v1/playlists/" +
          playlistResponse.data.id +
          "/tracks",
        {
          uris: tracks.map((track) => track.uri),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return addTracksResponse;
    }
  };

  export default addTracksToNewPlaylist;