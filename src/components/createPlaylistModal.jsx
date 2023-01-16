import "../App.css";
import styled from "styled-components";

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-template-rows: auto auto auto;
  gap: 10px;
  border-radius: 4px;
  align-items: flex-start;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  width: fit-content;
  margin-left: auto;
`;

const Modal = styled.dialog`
  align-self: center;
  width: 60vh;
  height: fit-content;
  border: 0px solid transparent;
  border-radius: 4px;
  padding-bottom: 10px;
  padding-left: 10px;

  @media (max-width: 600px) {
    width: 80%;
  }
`;

const CreatePlaylistModal = ({
  token,
  tracks,
  playlistName,
  handlePlaylistNameChange,
  playlistDescription,
  handlePlaylistDescriptionChange,
  handleClose,
  addTracksToNewPlaylist,
  handlePlaylistCreation,
}) => {
  return (
    <Modal open>
      <InputContainer>
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Give your playlist a name"
          value={playlistName}
          onChange={handlePlaylistNameChange}
        />
        <label for="desc">Description</label>
        <textarea
          id="desc"
          placeholder="Add an optional description"
          value={playlistDescription}
          onChange={handlePlaylistDescriptionChange}
        />
      </InputContainer>
      <ButtonContainer>
        <button
          disabled={playlistName.length === 0}
          onClick={() => {
            addTracksToNewPlaylist(
              token,
              tracks,
              playlistName,
              playlistDescription
            )
              .then((_) => {
                handlePlaylistCreation();
              })
              .catch((err) => {
                handlePlaylistCreation(err.message);
              });
          }}
        >
          Create
        </button>
        <button className="cancel" onClick={() => handleClose()}>
          Cancel
        </button>
      </ButtonContainer>
    </Modal>
  );
};

export default CreatePlaylistModal;
