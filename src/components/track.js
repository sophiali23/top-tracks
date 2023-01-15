import "../App.css";
import styled from "styled-components";

const BoldText = styled.p`
  font-weight: bold;
`;

const Rank = styled.p`
  width: 3%;
  text-align: right;
`;

const TrackImage = styled.img`
  margin-left: 4px;
`;

const formatSecs = (secs) => (secs < 10 ? "0" + String(secs) : String(secs));

const Track = ({ rank, name, artists, duration, previewUrl, imageUrl }) => {
  const artistsText = artists.join(", ");
  const mins = String(Math.floor(duration / 1000 / 60));
  const secs = formatSecs(Math.floor((duration / 1000) % 60));
  return (
    <div className="track-container">
      <Rank>{rank}</Rank>
      <TrackImage src={imageUrl} width="40px" height="40px"></TrackImage>
      <div className="text-container">
        <BoldText>{name}</BoldText>
        <p>{artistsText}</p>
      </div>
      <div className="time-container">
        <a className="preview-link" href={previewUrl} target="_blank">
          Preview
        </a>
        <BoldText>
          {mins}:{secs}
        </BoldText>
      </div>
    </div>
  );
};

export default Track;
