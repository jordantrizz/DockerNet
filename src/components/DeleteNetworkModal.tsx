import './modal.scss';
import { DebugErrorDetails } from '../utils/debugMode';
import { fetchJsonWithDebug, getDebugErrorDetails } from '../utils/fetchWithDebug';

interface IProps {
  toggleDeleteNetworkModal: () => void;
  networkToDelete: string;
  setNetworks: (networks: []) => void;
  networks: {
    driver: string;
    name: string;
    containers: [];
  }[];
  setErrorModalDisplay: (
    error: string,
    debugDetails?: DebugErrorDetails
  ) => void;
}

export const DeleteNetworkModal: React.FC<IProps> = ({
  toggleDeleteNetworkModal,
  networkToDelete,
  setNetworks,
  networks,
  setErrorModalDisplay,
}) => {
  // Locate the current network in state
  const currNetwork = networks.find(
    (network) => network.name === networkToDelete
  );

  const deleteNetwork = (networkName: string) => {
    fetchJsonWithDebug<[]>(
      `/api/networks/?networkName=${networkName}`,
      {
        method: 'DELETE',
      },
      'delete-network'
    )
      .then((networks) => {
        setNetworks(networks);
        toggleDeleteNetworkModal();
      })
      .catch((error) => {
        toggleDeleteNetworkModal();
        setErrorModalDisplay('remove-network-error', getDebugErrorDetails(error));
      });
  };

  const numberOfContainers = currNetwork?.containers.length;

  if (numberOfContainers) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div>
            {`${numberOfContainers} containers are currently connected to ${networkToDelete}. Please disconnect them before removing the network`}
          </div>
          <button className="modal-button" onClick={toggleDeleteNetworkModal}>
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div>{`Are you sure you want to delete ${networkToDelete}?`}</div>
          <div className="modal-buttons">
            <button
              className="modal-button"
              onClick={() => deleteNetwork(networkToDelete)}
            >
              Delete Network
            </button>
            <button className="modal-button" onClick={toggleDeleteNetworkModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
};
