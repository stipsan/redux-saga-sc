import { delay } from 'redux-saga'
import { call, put, race, take } from 'redux-saga/effects'

import { handleEmit } from './emit'

export function *deadline(timeRemaining) {
  yield call(delay, timeRemaining)
  const error = new Error('Socket request timed out waiting for a response')
  error.name = 'SocketTimeoutError'
  throw error
}

export function *request(socket, action, event, timeRemaining = socket.ackTimeout) {
  yield call(handleEmit, socket, action, event)
  const { payload: { successType, failureType } } = action
  const { response } = yield race({
    response: take([successType, failureType]),
    timeout: call(deadline, timeRemaining),
  })
  yield put(response)
}
