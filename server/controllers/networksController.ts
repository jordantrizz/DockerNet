import { Request, Response, NextFunction } from 'express';
import util from 'util';
import * as child_process from 'child_process';
import { formatNetworksAndContainers } from '../helpers/formatNetworksAndContainers';

// make the terminal commands return normal thenable promises
const exec = util.promisify(child_process.exec);

const DEFAULT_DOCKER_SOCKET_PATH = '/var/run/docker.sock';
const DEFAULT_DOCKER_CONNECTION_MODE = 'api';
const DEFAULT_DOCKER_API_FALLBACK_MODE = 'none';

const dockerSocketPath =
  process.env.DOCKER_SOCKET_PATH || DEFAULT_DOCKER_SOCKET_PATH;
const dockerConnectionMode =
  process.env.DOCKER_CONNECTION_MODE || DEFAULT_DOCKER_CONNECTION_MODE;
const dockerApiFallbackMode =
  process.env.DOCKER_API_FALLBACK_MODE || DEFAULT_DOCKER_API_FALLBACK_MODE;
const dockerApiVersionOverride = process.env.DOCKER_API_VERSION || '';

const sanitizeApiVersion = (version: string) =>
  version.trim().replace(/^v/i, '');

const isCliConnectionMode = () => dockerConnectionMode.toLowerCase() === 'cli';
const shouldFallbackToCli = () => dockerApiFallbackMode.toLowerCase() === 'cli';

const shellEscapeArg = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

const parseDockerJson = (stdout: string, operation: string) => {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(
      `Unable to parse Docker response in ${operation}: ${String(error)}`
    );
  }
};

const getDockerApiVersion = async () => {
  if (dockerApiVersionOverride.trim()) {
    return sanitizeApiVersion(dockerApiVersionOverride);
  }

  const escapedSocketPath = shellEscapeArg(dockerSocketPath);
  const { stdout, stderr } = await exec(
    `curl --silent --show-error --unix-socket ${escapedSocketPath} http://localhost/version`
  );

  if (!stdout) {
    throw new Error(
      stderr ||
        `Docker version endpoint returned no data for socket ${dockerSocketPath}`
    );
  }

  const versionResponse = parseDockerJson(stdout, 'getDockerApiVersion');
  const detectedApiVersion = sanitizeApiVersion(
    versionResponse.ApiVersion || ''
  );

  if (!detectedApiVersion) {
    throw new Error('Docker API version could not be detected from /version');
  }

  return detectedApiVersion;
};

const getNetworksWithApi = async () => {
  const apiVersion = await getDockerApiVersion();
  const escapedSocketPath = shellEscapeArg(dockerSocketPath);
  const { stdout, stderr } = await exec(
    `curl --silent --show-error --unix-socket ${escapedSocketPath} http://localhost/v${apiVersion}/networks`
  );

  if (!stdout) {
    throw new Error(
      stderr ||
        `Docker networks endpoint returned no data for socket ${dockerSocketPath}`
    );
  }

  return parseDockerJson(stdout, 'getNetworksWithApi');
};

const getNetworksWithCli = async () => {
  const { stdout, stderr } = await exec(
    'docker network inspect $(docker network ls -q)'
  );

  if (!stdout) {
    throw new Error(stderr || 'Docker CLI returned no network data');
  }

  return parseDockerJson(stdout, 'getNetworksWithCli');
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// JS Module pattern:
const networksController = (() => {
  const getNetworksAndContainers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let rawNetworksAndContainers;

      if (isCliConnectionMode()) {
        rawNetworksAndContainers = await getNetworksWithCli();
      } else {
        try {
          rawNetworksAndContainers = await getNetworksWithApi();
        } catch (error) {
          if (shouldFallbackToCli()) {
            console.warn(
              '[DockerNet][networks] API mode failed, falling back to CLI',
              {
                mode: dockerConnectionMode,
                socket: dockerSocketPath,
                error: getErrorMessage(error),
              }
            );
            rawNetworksAndContainers = await getNetworksWithCli();
          } else {
            throw error;
          }
        }
      }

      const networksAndContainers = formatNetworksAndContainers(
        rawNetworksAndContainers
      );

      res.locals.networksAndContainers = networksAndContainers;
      return next();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[DockerNet][networks] request failed', {
        mode: dockerConnectionMode,
        socket: dockerSocketPath,
        fallbackMode: dockerApiFallbackMode,
        error: message,
      });

      return next({
        log: `Docker connection failed in getNetworksAndContainers (mode=${dockerConnectionMode}, socket=${dockerSocketPath})`,
        message,
      });
    }
  };

  const createNetwork = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { networkName, driver } = req.body;
      // only checking for error as we don't need
      // the id of the new network returned from docker
      const { stderr } = await exec(
        `docker network create -d ${driver} ${networkName}`
      );

      if (stderr) {
        return next({
          log: 'Docker CLI Responsive but error in create network middleware',
          message: stderr,
        });
      }

      return next();
    } catch (error) {
      return next({
        log: 'Docker CLI unresponsive: error in create network middleware',
        message: error,
      });
    }
  };

  const deleteNetwork = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // name of network
      const { networkName } = req.query;

      // make sure that the network to remove
      // is not one of the default networks
      if (
        networkName === 'bridge' ||
        networkName === 'host' ||
        networkName === 'none'
      ) {
        return next({
          log: 'Attempt to delete default docker network',
        });
      }

      // only concerned with the error as the default
      // return from docker CLI here is not needed
      const { stderr } = await exec(`docker network rm ${networkName}`);

      if (stderr) {
        return next({
          log: 'Docker CLI Responsive but error in delete network middleware',
          message: stderr,
        });
      }

      return next();
    } catch (error) {
      return next({
        log: 'Docker CLI unresponsive: Error in delete network middleware',
        message: error,
      });
    }
  };

  return {
    getNetworksAndContainers,
    createNetwork,
    deleteNetwork,
  };
})();

export default networksController;
