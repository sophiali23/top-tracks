import "../App.css";
import styled from "styled-components";

const Modal = styled.dialog`
  align-self: center;
  width: 60vh;
  height: fit-content;
  border: 0px solid transparent;
  border-radius: 4px;

  @media (max-width: 600px) {
    width: 80%;
  }
`;

const SuccessModal = ({ handleClose }) => {
  return (
    <Modal open>
      <h2>You have successfully created a playlist.</h2>
      <button onClick={handleClose}>Close</button>
    </Modal>
  );
};

export default SuccessModal;
