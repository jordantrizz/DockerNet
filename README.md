<p align="center">
  <img width="256" height="256" src="./assets/ship-wheel-blue.png">
</p>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/DockerNet?color=blue">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/oslabs-beta/DockerNet?color=pink">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/DockerNet?color=green">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/oslabs-beta/DockerNet?style=social">  
</p>
<br/>

<p align="center">
  <img align="center" alt="TypeScript" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" />
  <img align="center" alt="HTML5" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" />
  <img align="center" alt="CSS3" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" />
  <img align="center" alt="Sass" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sass/sass.png" />
  <img align="center" alt="Node.js" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" />
  <img align="center" alt="React" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" />
  <img align="center" alt="Git" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
  <img align="center" alt="GitHub" width="26px" src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" />
  <img align="center" alt="Terminal" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/terminal/terminal.png" />
  <img align="center" alt="Docker" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png" />
  <img align="center" alt="NodeJS" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" />
  <img align="center" alt="Express" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png" />
  <img align="center" alt="ES-Lint" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/eslint/eslint.png" />

  <!-- 
  Missing: Jest, D3
   -->
</p>
<br>
<p align="center">
  Follow us on
</p>

<p align="center">
  <a align="center" href="https://www.linkedin.com/company/dockernet/"> 
    <img align="center" alt=DockerNet-LinkedIn src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white">
  </a>
</p>

<br />

# DockerNet
> An easy-to-use, locally-hosted web app for developers and engineers to visualize and manage their Docker Networks in real-time.
>
> This tool is best used before and/or during the development of a Docker Compose YML file.
---
## Table of Contents
- [DockerNet](#dockernet)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Getting Started](#getting-started)
  - [Looking Ahead](#looking-ahead)
  - [Authors](#authors)
  - [Acknowledgements](#acknowledgements)
  - [License](#license)
---
## About
>### Description
>[DockerNet.io][dockernet] provides developers with the tools needed to visualize and manage a Docker Network. Developers will have the ability to view their networks in both a list view and graphical view. Developers are also able to create new networks, delete current networks, add containers to a network, and remove containers from a network.
>
>DockerNet's interface allows users to easily and seamlessly navigate between networks. This feature proves most useful during the early development of a Docker Network configuration.
>
>DockerNet is designed to be used by developers who are new to the "Docker-verse" and appreciate having a visual aid. It also benefits seasoned developers who are designing a Docker Compose configuration as well as a means of verifying if a Docker compose file is correctly configured and behaving as expected.
>
>### Features
> - Visualize Docker Networks
> - Add/Remove Containers to Docker Networks
> - Create/Delete Docker Networks
>### Tech Stack
>- ES Lint / Prettier - TypeScript Linting Library
>- SASS/CSS - Styling preprocessor
>- React (Router & Hooks) - Front-end Library
>- git/GitHub - Version control and Remote Repository Manager
>- Docker - Container manager
>- Bash - Command Line Interface
>- Node.JS - Package Manager
>- Jest - Testing Framework
>- TypeScript - Strongly typed Programming Language
>- Webpack - Static module bundler
>- Express - Server middleware
>- D3 - Data Visualization Library
---
## Getting Started

>### Requirements
>1. Latest version of [Docker][docker]
>1. Docker daemon must be running on the host where DockerNet server runs
>1. Docker socket must be accessible to the server process
>### Installation
>1. Clone Repo to local device - `git clone https://github.com/oslabs-beta/DockerNet.git`
>1. Navigate to the DockerNet directory in terminal of chioce
>1. Install required packages on local device - `npm install`
>1. In the root directory rename `.env.example` file to `.env`
>
>_*Note:*_ 
>- Frontend and Server Ports are defaulted to 8081 and 3031, respectively 
>- These can be updated in the `.env` file found in the root directory
>
>### Docker Connectivity Configuration
>DockerNet supports Docker API over Unix socket by default and can be configured through `.env`:
>
>- `DOCKER_CONNECTION_MODE=api|cli`
>  - `api` (default): use Docker API over Unix socket
>  - `cli`: bypass socket/API and use Docker CLI for network discovery
>- `DOCKER_API_FALLBACK_MODE=none|cli`
>  - `none` (default): fail request when API/socket path is unavailable
>  - `cli`: if API/socket fails, retry network discovery through Docker CLI
>- `DOCKER_SOCKET_PATH=/var/run/docker.sock`
>  - Path to Docker Unix socket for API mode
>  - Set this when your Docker host uses a non-default socket path
>- `DOCKER_API_VERSION=`
>  - Optional override for API mode
>  - If blank, DockerNet auto-detects API version using `GET /version`
>
>Linux default socket:
>- `/var/run/docker.sock`
>
>If DockerNet runs as a non-root user on Linux, that user must have permission to access the Docker socket (for example, via docker group membership).
>### How to Use
>1. On your local device open Docker and ensure you have containers running
>1. Navigate to the DockerNet directory in terminal of chioce
>1. Start app using using the following command - `npm start`
>1. Wait for app to load in your default browser
>
>### Troubleshooting Docker Connectivity
>- Error similar to `client version 1.18 is too old... minimum supported API version is ...`:
>  - DockerNet now auto-detects API version from Docker `/version` when `DOCKER_API_VERSION` is not set.
>  - If you set `DOCKER_API_VERSION`, ensure it is supported by your Docker daemon.
>- Docker unresponsive in UI:
>  - Confirm Docker daemon is running on the same host as DockerNet server.
>  - Confirm `DOCKER_SOCKET_PATH` exists and is readable by the server process.
>  - If your environment does not expose a socket path, set `DOCKER_CONNECTION_MODE=cli`.
>- API mode still failing on socket/path issues:
>  - Set `DOCKER_API_FALLBACK_MODE=cli` to retry network discovery through Docker CLI automatically.
>
>### Frontend Debug Mode (Data Gathering)
>Use debug mode when UI data is missing and you need request-level diagnostics.
>
>- Debug mode is available in all environments and is off by default.
>- Enable debug mode from browser DevTools Console:
>  - `localStorage.setItem('dockernet-debug', '1')`
>  - Refresh the page.
>- Disable debug mode:
>  - `localStorage.removeItem('dockernet-debug')`
>  - Refresh the page.
>
>When enabled:
>- Frontend requests include `x-dockernet-debug: 1`.
>- Error modals include debug details for failed data requests:
>  - operation name
>  - request method + URL
>  - HTTP status
>  - server error message (when available)
>  - timestamp
>- Browser console logs request success/failure debug events under `[DockerNet][debug]`.
>
>### Startup Health Check Logs
>On server boot, DockerNet emits a one-time startup health log. Use it to diagnose Docker connectivity without calling API endpoints manually.
>
>API mode success example:
>```text
>[DockerNet][startup] Docker health check OK {
>  mode: 'api',
>  socket: '/var/run/docker.sock',
>  fallbackMode: 'none',
>  apiVersion: '1.54',
>  minApiVersion: '1.40',
>  engineVersion: '29.3.0'
>}
>```
>
>CLI mode success example:
>```text
>[DockerNet][startup] Docker health check OK {
>  mode: 'cli',
>  fallbackMode: 'none',
>  serverApiVersion: '1.54'
>}
>```
>
>Startup failure example:
>```text
>[DockerNet][startup] Docker health check FAILED {
>  mode: 'api',
>  socket: '/var/run/docker.sock',
>  fallbackMode: 'none',
>  apiVersionOverride: '(auto)',
>  error: 'permission denied'
>}
>```
>
>How to interpret startup logs:
>- `OK` with `mode: 'api'`: Docker socket and API negotiation are healthy.
>- `OK` with `mode: 'cli'`: Docker CLI path is healthy (socket path may not be used).
>- `FAILED`: Startup connectivity check failed. Use the `error` field and apply the matching fix below.
>
>Quick remediation by failure signature:
>- Daemon not running (`Cannot connect to the Docker daemon`): start Docker daemon/service on the server host.
>- Socket path missing (`No such file or directory`): set `DOCKER_SOCKET_PATH` to the correct Unix socket path.
>- Socket permission denied (`permission denied`): grant the server user access to Docker socket (for example docker group membership on Linux).
>- API override mismatch (`unsupported` or version mismatch): clear `DOCKER_API_VERSION` to use auto-detection or set a supported value.
>### Demo
>Create Network
> <p align="center"><img alt="create-network" src="./assets/create-network.gif"></p>
>Delete Network
> <p align="center"><img alt="delete-network" src="./assets/delete-network.gif"></p>
>Navigate to Network
> <p align="center"><img alt="navigate-to-network" src="./assets/navigate-to-network.gif"></p>
>Add container to Network
> <p align="center"><img alt="connect-container-to-network" src="./assets/connect-container-to-network.gif"></p>
>Remove container from Network
> <p align="center"><img alt="remove-container-from-network" src="./assets/remove-container-from-network.gif"></p>
>List view and Graph view
> <p align="center"><img alt="remove-container-from-network" src="./assets/switch-views.gif"></p>
---
## Looking Ahead
>### Roadmap
> Here's a list of features currently being considered by the development team:
>1. Updating Data Visualization to include more robust container and network information
>1. Updating Data Visualization to provide the same functionality as List Display
>1. Updating Main Display to include all Network/Container information in a single view
>1. Incorporating Docker Desktop features such as starting and stopping containers
>1. Dark Mode


---
## Authors
>### Creators
>- Bernie Green [@GitHub][bernie-github] [@LinkedIn][bernie-linkedin]
>- Nathan Yang [@GitHub][nathan-github] [@LinkedIn][nathan-linkedin]
>- Will Sankhla [@GitHub][will-github] [@LinkedIn][will-linkedin]
>- Wyatt McMurry [@GitHub][wyatt-github] [@LinkedIn][wyatt-linkedin]
>
>### Contributors
>- Will you be the first? See below for instructions on how to contribute
>
>### How to Contribute
>We love working with other developers in the open-source community! **Here's how to contribute:**
>1. Fork the Project
>1. Create your Feature Branch (`git checkout -b feature/NewFeature`)
>1. Commit your Changes (`git commit -m 'Add some NewFeature'`)
>1. Push to the Branch on your Fork (`git push origin feature/NewFeature`)
>1. Open a Pull Request from the Branch on your Fork to the master branch on the [DockerNet.io][dockernet] Main Branch

---
## Acknowledgements
>- Huge shoutout to [OSLabs][os-labs] and [CodeSmith][codesmith] for sponsoring the development of this product
>- Massive thank you to all the kind, considerate internet denizens who provided valuable feedback during the ideation period of this product
>- Gargantuan thank you to each and every individual who provided meaningful support (technical or non-technical) throughout the development of this product
>- Suporting Libraries:
>   - [React Force Graph][react-force-graph] - Graph data visualization library
>   - [TS-Node][ts-node] - TypeScript execution engine and REPL for Node.js
>   - [badges-4-readme][badges-4-readme] - Badges for readme profile

---
## License
>Distributed under the MIT License. See `LICENSE` for more information.


<!-- Links -->
[os-labs]: https://opensourcelabs.io
[codesmith]: https://codesmith.io
[dockernet]: http://dockernet.io
[dockernet-linkedin]: https://www.linkedin.com/company/dockernet/about/
[bernie-github]: https://github.com/bgreen280
[bernie-linkedin]: https://www.linkedin.com/in/bernardjosephgreen/
[will-github]: https://github.com/wills77
[will-linkedin]: https://www.linkedin.com/in/willsankhla/
[nathan-github]: https://github.com/nathanmyang
[nathan-linkedin]: https://www.linkedin.com/in/nathan-yang-76a35a14a/
[wyatt-github]: https://github.com/Dubya-Mick
[wyatt-linkedin]: https://www.linkedin.com/in/wyatt-mcmurry/
[ts-node]: https://github.com/TypeStrong/ts-node
[react-force-graph]: https://vasturiano.github.io/react-force-graph/
[docker]: https://www.docker.com/
[badges-4-readme]: https://github.com/alexandresanlim/Badges4-README.md-Profile
