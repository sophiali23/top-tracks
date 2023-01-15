import "../App.css";

const SuccessModal = ({ handleClose }) => {
  return (
    <dialog className="modal" open>
      <h2>You have successfully created a playlist.</h2>
      <button onClick={handleClose}>Close</button>
    </dialog>
  );
};

export default SuccessModal;
