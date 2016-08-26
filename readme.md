redux-saga-sc
===============

[![Travis branch](https://img.shields.io/travis/stipsan/redux-saga-sc.svg)](https://travis-ci.org/stipsan/redux-saga-sc)
[![Code Climate](https://codeclimate.com/github/stipsan/redux-saga-sc/badges/gpa.svg)](https://codeclimate.com/github/stipsan/redux-saga-sc)
[![Coverage Status](https://coveralls.io/repos/github/stipsan/redux-saga-sc/badge.svg)](https://coveralls.io/github/stipsan/redux-saga-sc)
[![npm package](https://img.shields.io/npm/dm/redux-saga-sc.svg)](https://www.npmjs.com/package/redux-saga-sc)

[![NPM](https://nodei.co/npm/redux-saga-sc.png?downloadRank=true)](https://www.npmjs.com/package/redux-saga-sc)
[![NPM](https://nodei.co/npm-dl/redux-saga-sc.png?months=3&height=2)](https://nodei.co/npm/redux-saga-sc/)


This package provides ready to use sagas to connect SocketCluster clients.
It can be used to let your server dispatch redux actions on the client and vice verca.
Or to sync a shared redux state across multiple nodes or clients.

# Examples
* [redux-saga-sc-demo](https://github.com/stipsan/redux-saga-sc-demo) - A demo chat app showing redux-saga-sc in action
* [epic](https://github.com/stipsan/epic) - React example project, that takes you from fun development to high quality production

# Documentation

* [Sending actions between remote redux stores](#sending-actions-between-remote-redux-stores)
  * [Sending notifications with `socketEmit` action creator](#sending-notifications-with-socketemit-action-creator)
  * [Requesting data with `socketRequest`](#requesting-data-with-socketrequest)
* [Advanced](#advanced)
  * [Using the `createEventChannel` factory to connect to socket events](#using-the-createeventchannel-factory-to-connect-to-socket-events)
  * [Using the `createChannelSubscription` factory to connect to socket channels](#using-the-createchannelsubscription-factory-to-connect-to-socket-channels)

### Sending actions between remote redux stores

You'll notice that this guide does not use the terms "server" and "client". Why? You could use this server to server, client to client, it doesn't matter. Instead you have a "sender" and a "receiver".
The "sender" can `emit` something, the "receiver" listens for the `emit` and may decide to `emit` something back in response.
The "sender" can also `request` something from the "receiver" requiring a response of either `successType` or `failureType`.

#### Sending notifications with `socketEmit` action creator

You can use `socketEmit` to dispatch simple actions that does not require a response. If there's a network problem, like if the device switch between a 3G to 4G connection, it'll automatically retry sending the `emit` until it gets a delivery notification back from the receiver.

To use it, wrap your action that you want dispatched on the remote redux store like this:

`./actions/chat.js`
```js
import { socketEmit } from 'redux-saga-sc'

import {
  RECEIVE_MESSAGE,
} from '../constants/ActionTypes'

export const sendMessage = (message, sender) => socketEmit({
  type: RECEIVE_MESSAGE,
  payload: {
    message,
    sender,
  },
})
```

Next step is to setup the watcher that will take actions created by `socketEmit` and send it over the websocket for us.

`./sagas/index.js`
```js
import { watchRequests } from 'redux-saga-sc'

import socketCluster from 'socketcluster-client'

const socket = socketCluster.connect()

export default function *sagas() {
  yield [
    ... // your other sagas
    watchEmits(socket),
  ]
}
```

And the last step is to add the `watchRemote` worker to the receiver, in this example the receiver is a SocketCluster workerController:
`./web/worker.js`
```js
import express from 'express'

import createStore from './store'

export const run = worker => {
  const app = express()

  worker.httpServer.on('request', app)

  worker.scServer.on('connection', socket => createStore(socket))
}
```
`./web/store.js`
```js
import * as reducers from '../reducers'

import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import sagas from '../sagas'

export default (socket) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers(reducers),
    applyMiddleware(sagaMiddleware)
  )

  sagaMiddleware.run(sagas, socket)

  return store
}
```
`./web/sagas/index.js`
```js
import { watchRemote } from 'redux-saga-sc'

export default function *sagas(socket) {
  yield [
    ... // your other sagas
    watchRemote(socket)
  ]
}
```

You can setup this on both sides of the websocket if you need the ability to pass actions back and forth.
Actions will dispatch like any other action.
Meaning you can use
```js
yield take(RECEIVE_MESSAGE)
```
in the sagas of your receiver to act on it. And you can also use `RECEIVE_MESSAGE` in your reducers.
The actions you dispatch wrapped in `socketEmit` only dispatch on the receiver, not the local redux store.
It will automatically retry if the server does not respond.

By default emits will be done on the "dispatch" event on SocketCluster. You can change this by passing a second argument to socketEmit and use whatever event you want.
Just be sure to set the `watchRemote` saga on the receiver to the same event, as that too use 'dispatch' as the default event.

#### Requesting data with `socketRequest`

While `socketEmit` is useful for notifications and other stuff that you don't need to know the result, only that it was delivered, there's `socketRequest` that is suitable for more advanced situations.
When you do a `socketRequest` you have to pass both a `successType` and `failureType` that the receiver must emit back in a given timeframe.

Here's an example:
`./actions/auth.js`
```js
import { socketRequest } from 'redux-saga-sc'

import {
  AUTHENTICATE_REQUESTED,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILURE,
} from '../constants/ActionTypes'

export const signInWithEmailAndPassword = credentials => socketRequest({
  type: AUTHENTICATE_REQUESTED,
  payload: {
    successType: AUTHENTICATE_SUCCESS,
    failureType: AUTHENTICATE_FAILURE,
    credentials,
  },
})
```

To dispatch socket requests, setup `watchRequests` the same way you did `watchEmits`.

You setup the receiver just like you do in the `socketEmit` example, using `watchRemote`.
There are two important differences though. First of all, unlike `socketEmit`, the action you pass in `socketRequest` will also dispatch locally. This is to allow for stuff like creating progress spinners and similar.
The other difference is that you need to setup your own watcher that will act on the `AUTHENTICATE_REQUESTED` in this example, and return either `AUTHENTICATE_SUCCESS` or `AUTHENTICATE_FAILURE`.

Here's what it should look like:
`./web/sagas/auth.js`
```js
import { socketEmit } from 'redux-saga-sc'

import { authenticate } from '../models/user'
import {
  AUTHENTICATE_REQUESTED
} from '../constants/ActionTypes'

export function *watchAuthenticateRequest(socket) {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: {
      successType,
      failureType,
      credentials,
    } } = yield take(AUTHENTICATE_REQUESTED)
    try {
      const authToken = yield call(authenticate, credentials)
      yield put(socketEmit({ type: successType, payload: authToken }))
    } catch(err) {
      yield put(socketEmit({ type: failureType, payload: err }))
    }
  }
}
```

## Advanced

A little more info on lower level stuff if you need to do more than what the provided watchers and action creators provides out of the box.

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

### Using the `createChannelSubscription` factory to connect to socket channels

One of the coolest features of SocketCluster are [channels](http://socketcluster.io/#!/docs/api-scchannel-client).
Especially when you use channels on the [Exchange](http://socketcluster.io/#!/docs/api-exchange) as it allows you to distribute actions both vertically (multiple worker processes) and horizontally (multiple servers).

Since publishing to a channel is very straightforward there's no utility in `redux-saga-sc` for that, the example below shows you how it's done (`exchange` in these examples are assumed to be `scWorker.exchange` passed to the store from your workerController, that's how it's done in [redux-saga-sc-demo](https://github.com/stipsan/redux-saga-sc-demo)):

```js
import { cps, take } from 'redux-saga/effects'

export function *watchMessages(exchange) {
  while (true) { // eslint-disable-line no-constant-condition
    const message = yield take('MESSAGE')
    yield cps([exchange, exchange.publish], 'chat', message)
  }
}
```

And here's how createChannelSubscription is implemented to dispatch actions from the channel:
```js
import { call, take, put } from 'redux-saga/effects'
import { socketEmit, createChannelSubscription } from 'redux-saga-sc'

export function *watchExchange(socket, exchange) {
  const chan = yield call(createChannelSubscription, exchange, 'chat')

  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(chan)
    yield put(socketEmit(action))
  }
}
```
