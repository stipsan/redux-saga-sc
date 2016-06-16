redux-saga-sc
===============

This package provides ready to use sagas to connect SocketCluster clients.
It can be used to let your server dispatch redux actions on the client and vice verca.
Or to sync a shared redux state across multiple nodes or clients.

# Documentation

### Using the `createEventChannel` factory to connect to socket events

On the client:
```js
import { createEventChannel } from 'redux-saga-sc'
import socketCluster from 'socketcluster-client'

const socket = socketCluster.connect({
  hostname: process.env.SOCKET_HOSTNAME || location.hostname
})

export function *watchIncomingActions() {
  const chan = yield call(createEventChannel, socket, 'dispatch')
  while (true) {
    const action = yield take(chan)
    yield put(action)
  }
}
```

On the server:

```js
socket.emit('dispatch', {type: 'MY_ACTION', payload: { foo: 'bar' }}, () => {
  console.log('Client dispatched the action!')
})
```
