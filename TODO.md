# TODO

## Client Side Cache

* When making code changes, and refeshing the site sometimes the networks don't show up, an incognito window is required. This needs to be investigated

## Debug Mode

* At times data on the front-end isn't being displayed and no error message is present.
* Create a debug mode that can be turned on to show more detailed error messages and logs to help with debugging.
* This would specifically be related to gathering data to display in the UI.

## Connect Container Error
```
[1] [DockerNet][api] GET /api/networks -> 304 (28ms)
[1] [DockerNet][error] {
[1]   method: 'GET',
[1]   path: '/api/containers',
[1]   log: 'Docker CLI unresponsive: error in get running containers middleware',
[1]   message: Error: Command failed: docker ps --format '{ "name": "{{ .Names }}"}'
[1]   Failed to initialize: invalid API version (root): must be formatted <major>.<minor>
[1]
[1]       at genericNodeError (node:internal/errors:985:15)
[1]       at wrappedFn (node:internal/errors:539:14)
[1]       at ChildProcess.exithandler (node:child_process:417:12)
[1]       at ChildProcess.emit (node:events:509:28)
[1]       at ChildProcess.emit (node:domain:489:12)
[1]       at maybeClose (node:internal/child_process:1124:16)
[1]       at Process.ChildProcess._handle.onexit (node:internal/child_process:306:5) {
[1]     code: 1,
[1]     killed: false,
[1]     signal: null,
[1]     cmd: `docker ps --format '{ "name": "{{ .Names }}"}'`,
[1]     stdout: '',
[1]     stderr: 'Failed to initialize: invalid API version (root): must be formatted <major>.<minor>\n'
[1]   }
```