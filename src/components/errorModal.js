import "../App.css";
import styled from "styled-components";

const Title = styled.h3`
  font-weight: 500;
`;

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

const ErrorModal = ({ handleClose, message }) => {
  const errorMessage = message.match("401")
    ? "Sorry! There was an error with authenticating your Spotify account. You have a bad or expired token. Please re-authenticate by logging out and logging back in."
    : "Sorry! There was an error. Please refresh the page and try again.";
  return (
    <Modal open>
      <Title>{`${message}`}</Title>
      <p>{errorMessage}</p>
      <button onClick={handleClose}>Close</button>
    </Modal>
  );
};

export default ErrorModal;
