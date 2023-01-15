import "../App.css";

const formatSecs = (secs) => (secs < 10 ? "0" + String(secs) : String(secs));

const Track = ({ rank, name, artists, duration, previewUrl, imageUrl }) => {
  const artistsText = artists.join(", ");
  const mins = String(Math.floor(duration / 1000 / 60));
  const secs = formatSecs(Math.floor((duration / 1000) % 60));
  return (
    <div className="track-container">
      <p className="rank">{rank}</p>
      <img className="cover" src={imageUrl} width="40px" height="40px"></img>
      <div className="text-container">
        <p className="bold-text">{name}</p>
        <p>{artistsText}</p>
      </div>
      <div className="time-container">
        <a className="preview-link" href={previewUrl} target="_blank">
          Preview
        </a>
        <p className="bold-text">
          {mins}:{secs}
        </p>
      </div>
    </div>
  );
};

export default Track;
