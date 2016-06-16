redux-saga-sc
===============

[![Travis branch](https://img.shields.io/travis/stipsan/redux-saga-sc.svg)](https://travis-ci.org/stipsan/redux-saga-sc)
[![Code Climate](https://codeclimate.com/github/stipsan/redux-saga-sc/badges/gpa.svg)](https://codeclimate.com/github/stipsan/redux-saga-sc)
[![Coverage Status](https://coveralls.io/repos/github/stipsan/redux-saga-sc/badge.svg)](https://coveralls.io/github/stipsan/redux-saga-sc)
[![npm package](https://img.shields.io/npm/dm/redux-saga-sc.svg)](https://www.npmjs.com/package/redux-saga-sc)

[![NPM](https://nodei.co/npm/redux-saga-sc.png)](https://www.npmjs.com/package/redux-saga-sc)


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

# Roadmap

### `actionChannel` that emit socket events, with automatic retry on failures

### worker that can load balance `actionChannel` tasks, allowing socket emits to work in parallel

### effects for easy usage of [socket channel subscriptions](http://socketcluster.io/#!/docs/api-scchannel-client)
