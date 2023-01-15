import '../App.css';

const CreatePlaylistModal = ({token, tracks, playlistName, handlePlaylistNameChange, playlistDescription, handlePlaylistDescriptionChange, handleClose, addTracksToNewPlaylist, handlePlaylistCreation}) => {
    return (
      <dialog className="modal" open>
        <div className="t-container">
          <label for="name">Name</label>
          <input id="name" type="text" placeholder="Give your playlist a name" value={playlistName} onChange={handlePlaylistNameChange}/>
          <label for="desc">Description</label>
          <textarea id="desc" placeholder="Add an optional description" value={playlistDescription} onChange={handlePlaylistDescriptionChange}/>
        </div>
        <div className="buttons">
          <button disabled={playlistName.length === 0} onClick={() => {
            addTracksToNewPlaylist(token, tracks, playlistName, playlistDescription).then(result => {
              handlePlaylistCreation();
            }).catch(err => {
              handlePlaylistCreation(err.message);
            })}}>Create</button>
          <button className="cancel" onClick={() => handleClose()}>Cancel</button>
        </div>
      </dialog>
    )
  }

export default CreatePlaylistModal;