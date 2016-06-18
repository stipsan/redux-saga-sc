import { take, put, call } from 'redux-saga/effects'

import { createEventChannel } from '../src'

export function *watchRemote(socket, event = 'dispatch') {
  const chan = yield call(createEventChannel, socket, event)
  while (true) { // eslint-disable-line
    const action = yield take(chan)
    yield put(action)
  }
}
