import { channel, buffers } from 'redux-saga'
import { actionChannel, call, fork, put, take } from 'redux-saga/effects'

import { EMIT, REQUEST } from './actions'
import { createEventChannel } from './eventChannel'
import { processRequest, handleEmit } from './workers'

export function *watchEmits(socket, retries = 5) {
  const emitChan = yield actionChannel(EMIT)
  while (true) { // eslint-disable-line
    const { event, payload } = yield take(emitChan)
    yield call(handleEmit, socket, payload, event, retries)
  }
}

export function *watchRemote(socket, event = 'dispatch') {
  const chan = yield call(createEventChannel, socket, event)
  while (true) { // eslint-disable-line
    const action = yield take(chan)
    yield put(action)
  }
}

export function *watchRequests(socket, retries = 5) {
  const requestChan = yield actionChannel(REQUEST)

  while (true) { // eslint-disable-line
    const payload = yield take(requestChan)
    yield call(processRequest, socket, payload, retries)
  }
}
