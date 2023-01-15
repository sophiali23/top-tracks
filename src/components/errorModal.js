import '../App.css'

const ErrorModal = ({handleClose, message}) => {
    const errorMessage = message.match("401") ? "Sorry! There was an error with authenticating your Spotify account. You have a bad or expired token. Please re-authenticate by logging out and logging back in." 
    : "Sorry! There was an error. Please refresh the page and try again.";
    return(
      <dialog className="modal error-modal" open>
        <h3>{`${message}`}</h3>
        <p>{errorMessage}</p>
        <button onClick={handleClose}>Close</button>
      </dialog>
    )
    }

export default ErrorModal;