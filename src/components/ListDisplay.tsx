import React from 'react';
import './listDisplay.scss';
import { DebugErrorDetails } from '../utils/debugMode';
import { fetchJsonWithDebug, getDebugErrorDetails } from '../utils/fetchWithDebug';

interface IProps {
  containers: {
    id: string;
    name: string;
    ipAddress: string;
  }[];
  network?: {
    driver: string;
    name: string;
  };
  setNetworks: (networks: []) => void;
  setErrorModalDisplay: (
    error: string,
    debugDetails?: DebugErrorDetails
  ) => void;
}

export const ListDisplay: React.FC<IProps> = ({
  containers,
  network,
  setNetworks,
  setErrorModalDisplay,
}) => {
  const disconnectContainer = (networkName: string, containerName: string) => {
    fetchJsonWithDebug<[]>(
      '/api/containers',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          networkName: networkName,
          containerName: containerName,
        }),
      },
      'disconnect-container'
    )
      .then((networks) => {
        setNetworks(networks);
      })
      .catch((error) => {
        setErrorModalDisplay(
          'disconnect-container-error',
          getDebugErrorDetails(error)
        );
      });
  };

  const containerList = containers.map((container) => {
    return (
      <React.Fragment key={container.id}>
        <div className="container-list-item">{`${container.name}`}</div>
        <div className="container-list-item">{`${container.id}`}</div>
        <div className="container-list-item">{`${container.ipAddress}`}</div>
        <button
          onClick={() => disconnectContainer(network.name, container.name)}
        >
          Disconnect
        </button>
      </React.Fragment>
    );
  });

  return (
    <div className="list-display">
      <div className="column-header">Name</div>
      <div className="column-header">ID</div>
      <div className="column-header">IP Address</div>
      <div></div>
      {containerList}
    </div>
  );
};
