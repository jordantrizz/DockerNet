/* eslint-disable jsx-a11y/no-onchange */
import './modal.scss';
import { useState, useEffect } from 'react';
import { DebugErrorDetails } from '../utils/debugMode';
import { fetchJsonWithDebug, getDebugErrorDetails } from '../utils/fetchWithDebug';

interface IProps {
  networkName: string | undefined;
  toggleConnectContainerModal: () => void;
  containers: {
    id: string;
    name: string;
    ipAddress: string;
  }[];
  setNetworks: (networks: []) => void;
  setErrorModalDisplay: (
    error: string,
    debugDetails?: DebugErrorDetails
  ) => void;
}

interface IState {
  runningContainers: {
    name: string;
  }[];
}

export const ConnectContainerModal: React.FC<IProps> = ({
  networkName,
  toggleConnectContainerModal,
  containers,
  setNetworks,
  setErrorModalDisplay,
}) => {
  // controlled component state for select input
  const [containerToConnectInput, setContainerToConnectInput] =
    useState<string>('');

  // for storing list of currently running containers
  // these are used to create options for conntect in select input
  const [runningContainers, setRunningContainers] = useState<
    IState['runningContainers']
  >([]);

  const connectContainer = (
    networkName: string | undefined,
    containerName: string
  ) => {
    if (!networkName || !containerName) return;
    fetchJsonWithDebug<[]>(
      '/api/containers',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          networkName: networkName,
          containerName: containerName,
        }),
      },
      'connect-container'
    )
      .then((networks) => {
        toggleConnectContainerModal();
        setNetworks(networks);
      })
      .catch((error) => {
        toggleConnectContainerModal();
        setErrorModalDisplay(
          'connect-container-error',
          getDebugErrorDetails(error)
        );
      });
  };

  const getRunningContainers = () => {
    fetchJsonWithDebug<IState['runningContainers']>(
      '/api/containers',
      {
        method: 'GET',
      },
      'get-running-containers'
    )
      .then((containers) => {
        setRunningContainers(containers);
      })
      .catch((error) => {
        toggleConnectContainerModal();
        setErrorModalDisplay(
          'get-running-containers-error',
          getDebugErrorDetails(error)
        );
      });
  };

  const currentContainerNames = containers.map((container) => container.name);

  useEffect(() => {
    getRunningContainers();
  }, []);

  // filter out containers already connected to the network:
  // for preventing attempt to doubly connect a container
  const selectOptions = runningContainers.map((container) => {
    if (!currentContainerNames.includes(container.name)) {
      return (
        <option key={container.name} value={container.name}>
          {container.name}
        </option>
      );
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        {`Choose a container to connect to ${networkName}`}
        <select
          className="modal-select"
          name="containerSelect"
          value={containerToConnectInput}
          onChange={(e) => setContainerToConnectInput(e.target.value)}
        >
          <option value="">Select Container</option>
          {selectOptions}
        </select>
        <button
          className="modal-button"
          onClick={() => connectContainer(networkName, containerToConnectInput)}
        >
          Connect
        </button>
        <button className="modal-button" onClick={toggleConnectContainerModal}>
          Cancel
        </button>
      </div>
    </div>
  );
};
