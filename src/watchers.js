import { channel } from 'redux-saga'
import { call, fork, put, take } from 'redux-saga/effects'

import { REQUEST } from './actions'
import { createEventChannel } from './eventChannel'
import { processRequest } from './workers'

export function *watchRemote(socket, event = 'dispatch') {
  const chan = yield call(createEventChannel, socket, event)
  while (true) { // eslint-disable-line
    const action = yield take(chan)
    yield put(action)
  }
}

export function *watchRequests(socket, concurrency = 3, retries = 5) {
  const chan = yield call(channel)

  for (let i = 0; i < concurrency; i++) {
    yield fork(processRequest, socket, chan, retries)
  }

  while (true) {
    const payload = yield take(REQUEST)
    yield put(chan, payload)
  }
}
