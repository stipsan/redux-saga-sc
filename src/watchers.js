import { takeEvery } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

import { EMIT, REQUEST } from './actions'
import { createEventChannel } from './eventChannel'
import { handleEmit, handleRequest } from './workers'

export function *watchEmits(socket) {
  yield* takeEvery(EMIT, handleEmit, socket)
}

export function *watchRequests(socket) {
  yield* takeEvery(REQUEST, handleRequest, socket)
}

export function *watchRemote(socket, event = 'dispatch') {
  const chan = yield call(createEventChannel, socket, event)
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(chan)
    yield put(action)
  }
}
