import { LoadingSpinner } from '../utils/LoadingSpinner';
import { DebugErrorDetails } from '../utils/debugMode';
import './modal.scss';

interface IProps {
  error: string;
  debugEnabled: boolean;
  debugDetails?: DebugErrorDetails;
  setErrorModalDisplay: () => void;
}

export const ErrorModal: React.FC<IProps> = ({
  error,
  debugEnabled,
  debugDetails,
  setErrorModalDisplay,
}) => {
  // Render the appropriate error message depending on the error

  let errorModalContent;
  if (error === 'connect-container-error') {
    errorModalContent = (
      <>
        Error connecting container. Please try again.
        <button onClick={setErrorModalDisplay}>Close</button>
      </>
    );
  } else if (error === 'disconnect-container-error') {
    errorModalContent = (
      <>
        Error disconnecting container. Please try again.
        <button onClick={setErrorModalDisplay}>Close</button>
      </>
    );
  } else if (error === 'create-network-error') {
    errorModalContent = (
      <>
        Error creating network. Please try again.
        <button onClick={setErrorModalDisplay}>Close</button>
      </>
    );
  } else if (error === 'remove-network-error') {
    errorModalContent = (
      <>
        Error deleting network. Please try again.
        <button onClick={setErrorModalDisplay}>Close</button>
      </>
    );
  } else if (error === 'get-running-containers-error') {
    errorModalContent = (
      <>
        Error getting running containers. Please try again.
        <button onClick={setErrorModalDisplay}>Close</button>
      </>
    );
  }

  const debugMessage = debugDetails?.serverError || debugDetails?.networkError;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <LoadingSpinner />
        {errorModalContent}
        {debugEnabled && debugDetails ? (
          <div style={{ marginTop: '1rem', textAlign: 'left', width: '100%' }}>
            <strong>Debug Details</strong>
            <div>Operation: {debugDetails.operation}</div>
            <div>Request: {`${debugDetails.method} ${debugDetails.url}`}</div>
            {debugDetails.status ? <div>Status: {debugDetails.status}</div> : null}
            {debugMessage ? <div>Server Message: {debugMessage}</div> : null}
            <div>Timestamp: {debugDetails.timestamp}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
