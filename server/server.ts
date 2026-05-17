import express, {
  Application,
  Request,
  Response,
  ErrorRequestHandler,
} from 'express';
import networksRouter from './routes/networksRouter';
import containersRouter from './routes/containersRouter';
import path from 'path';
import * as dotenv from 'dotenv';
import util from 'util';
import * as child_process from 'child_process';

dotenv.config();

const serverPort = process.env.SERVER_PORT || 3031;
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

const shellEscapeArg = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

const truthyValues = new Set(['1', 'true', 'on', 'yes']);

const isTruthy = (value: unknown): boolean => {
  if (typeof value === 'string') return truthyValues.has(value.toLowerCase());
  if (Array.isArray(value)) return value.some((item) => isTruthy(item));
  return false;
};

const shouldIncludeDebugResponse = (req: Request): boolean => {
  const headerValue = req.header('x-dockernet-debug');
  const queryValue = req.query.debug;

  return isTruthy(headerValue) || isTruthy(queryValue);
};

const getErrorMessage = (message: unknown): string => {
  if (typeof message === 'string') return message;
  if (message instanceof Error) return message.message;

  try {
    return JSON.stringify(message);
  } catch (error) {
    return 'error occurred';
  }
};

const logDockerStartupHealth = async () => {
  const normalizedMode = dockerConnectionMode.toLowerCase();

  try {
    if (normalizedMode === 'cli') {
      const { stdout, stderr } = await exec(
        "docker version --format '{{.Server.APIVersion}}'"
      );

      if (!stdout) {
        throw new Error(stderr || 'Docker CLI version command returned no data');
      }

      console.log('[DockerNet][startup] Docker health check OK', {
        mode: 'cli',
        fallbackMode: dockerApiFallbackMode,
        serverApiVersion: stdout.trim() || 'unknown',
      });
      return;
    }

    const escapedSocketPath = shellEscapeArg(dockerSocketPath);
    const { stdout, stderr } = await exec(
      `curl --silent --show-error --unix-socket ${escapedSocketPath} http://localhost/version`
    );

    if (!stdout) {
      throw new Error(
        stderr || `No response from Docker /version on socket ${dockerSocketPath}`
      );
    }

    const version = JSON.parse(stdout);

    console.log('[DockerNet][startup] Docker health check OK', {
      mode: 'api',
      socket: dockerSocketPath,
      fallbackMode: dockerApiFallbackMode,
      apiVersion:
        dockerApiVersionOverride.trim() || version.ApiVersion || 'unknown',
      minApiVersion: version.MinAPIVersion || 'unknown',
      engineVersion: version.Version || 'unknown',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error('[DockerNet][startup] Docker health check FAILED', {
      mode: dockerConnectionMode,
      socket: dockerSocketPath,
      fallbackMode: dockerApiFallbackMode,
      apiVersionOverride: dockerApiVersionOverride || '(auto)',
      error: message,
    });
  }
};

const app: Application = express();

app.use(express.json());

app.use('/api', (req: Request, res: Response, next) => {
  const startedAt = Date.now();
  const debugEnabled = shouldIncludeDebugResponse(req);

  if (debugEnabled) {
    console.log('[DockerNet][api][debug] request start', {
      method: req.method,
      path: req.originalUrl,
      hasBody: Boolean(req.body && Object.keys(req.body).length),
      query: req.query,
    });
  }

  res.on('finish', () => {
    const elapsedMs = Date.now() - startedAt;
    const logLine = `[DockerNet][api] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs}ms)`;

    if (res.statusCode >= 400) console.error(logLine);
    else console.log(logLine);
  });

  next();
});

app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.get('/', (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
});

// all traffic to /api/networks
app.use('/api/networks', networksRouter);

// all traffic to /api/containers
app.use('/api/containers', containersRouter);

// wildcard route always returns html
// so that client side react routes don't 404
app.get('*', (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
});

// global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const defaultErr = {
    log: 'unknown middleware error',
    status: 400,
    message: { err: 'error occurred' },
  };
  const errorObj = {
    ...defaultErr,
    status: typeof err.status === 'number' ? err.status : defaultErr.status,
    log: err.log || defaultErr.log,
    message: {
      err: getErrorMessage(err.message || defaultErr.message.err),
    },
  };

  const includeDebugResponse = shouldIncludeDebugResponse(req);

  console.error('[DockerNet][error]', {
    method: req.method,
    path: req.originalUrl,
    status: errorObj.status,
    log: errorObj.log,
    message: errorObj.message.err,
    debugRequest: includeDebugResponse,
  });

  const responseBody: {
    err: string;
    debug?: {
      method: string;
      path: string;
      status: number;
      log: string;
      timestamp: string;
    };
  } = {
    err: errorObj.message.err,
  };

  if (includeDebugResponse) {
    responseBody.debug = {
      method: req.method,
      path: req.originalUrl,
      status: errorObj.status,
      log: errorObj.log,
      timestamp: new Date().toISOString(),
    };
  }

  return res.status(errorObj.status).json(responseBody);
};

app.use(errorHandler);

app.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
  void logDockerStartupHealth();
});
