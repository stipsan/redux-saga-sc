import { channel } from 'redux-saga'
import { actionChannel, call, fork, put, take } from 'redux-saga/effects'

import { EMIT, REQUEST } from './actions'
import { createEventChannel } from './eventChannel'
import { processRequest, handleEmit } from './workers'

export function *watchEmits(socket, retries = 5) {
  const emitChan = yield actionChannel(EMIT)
  while (true) { // eslint-disable-line
    const { event, payload } = yield take(emitChan)
    yield call(handleEmit, socket, event, payload, retries)
  }
}

export function *watchRemote(socket, event = 'dispatch') {
  const chan = yield call(createEventChannel, socket, event)
  while (true) { // eslint-disable-line
    const action = yield take(chan)
    yield put(action)
  }
}

export function *watchRequests(socket, workers = 3, retries = 5) {
  const chan = yield call(channel)

  for (let i = 0; i < workers; i++) {
    yield fork(processRequest, socket, chan, retries)
  }

  while (true) { // eslint-disable-line
    const payload = yield take(REQUEST)
    yield put(chan, payload)
  }
}
