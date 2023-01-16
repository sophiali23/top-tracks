import axios from "axios";

const getTopTracks = async (
    token,
    timeRange,
    limit,
    updateTopTracks,
    handleError
  ) => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: timeRange,
            limit: limit,
            offset: 0,
          },
        }
      );
      updateTopTracks(
        data.items.map((item, index) => ({
          rank: index + 1,
          id: item.id,
          uri: item.uri,
          name: item.name,
          artists: item.artists.map((artist) => artist.name),
          duration: item.duration_ms,
          imageUrl: item.album.images[0].url,
          previewUrl: item.preview_url,
        }))
      );
    } catch (err) {
      handleError(err.message);
    }
  };

  export default getTopTracks;
  