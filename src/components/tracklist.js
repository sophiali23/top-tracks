import "../App.css";
import Track from "./track.js";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 35%;
  max-height: 70vh;
  overflow: auto;

  @media (max-width: 960px) {
    width: 70%;
  }

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const TrackList = ({ tracks }) => {
  return (
    <Container>
      {tracks.map((track) => (
        <Track key={track.id} {...track} />
      ))}
    </Container>
  );
};

export default TrackList;
