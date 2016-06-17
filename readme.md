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

## Dispatch actions remotely

### Simple one-way actions using `emit`

For simpler cases like firing a notification when a friend came online and the like.
The sender does not need to know how the receiver handle the incoming action, it only need to know the action was delivered successfully.

Below is an example of how you implement `emit` on the sender.
Note that even though we're using `call`, this isn't blocking. You can emit as many messages as you want and they'll just run in parallel.
```js
import { emit } from 'redux-saga-sc'

export function *watchSocketEmit() {
  while(true) {
    const action = yield take(SOCKET_EMIT)
    yield call(emit, socket, action, 'dispatch')
  }
}
```

Please note that if your receiver is listening to the emit without using `createEventChannel` you have to make sure you call the callback.
In other words update this:
```js
socket.on('dispatch', (action) => {
  store.dispatch(action)
})
```
to:
```js
socket.on('dispatch', (action, cb) => {
  cb()
  store.dispatch(action)
})
```
What's cb doing? It's [sending back](http://socketcluster.io/#!/docs/handling-failure) a message to the `socket` on the server letting it know the action was received successfully.

## Using Channels

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
