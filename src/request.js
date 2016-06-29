import { delay } from 'redux-saga'
import { call, race, take } from 'redux-saga/effects'

import { emit } from './emit'

export function *request(socket, action, event, timeRemaining = socket.ackTimeout) {
  yield call(emit, socket, action, event)
  const { payload: { successType, failureType } } = action
  const { response } = yield race({
    response: take([successType, failureType]),
    timeout: call(delay, timeRemaining),
  })
  if (!response) {
    const error = new Error('Socket request timed out waiting for a response')
    error.name = 'SocketTimeoutError'
    throw error
  }
  return response
}
