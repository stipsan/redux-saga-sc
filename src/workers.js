import { delay } from 'redux-saga'
import { call } from 'redux-saga/effects'

import { callEmit } from './emit'

export function *handleEmit(socket, action, event = 'dispatch', retries = 5) {
  let i = 0
  for (i; i <= retries; i++) {
    try {
      return yield call(callEmit, socket, action, event)
    } catch (err) {
      if (i < retries) {
        yield call(delay, 2000)
      }
    }
  }
  const error = new Error(`Socket emit failed ${i} times. Giving up.`)
  error.name = 'SocketEmitError'
  throw error
}
