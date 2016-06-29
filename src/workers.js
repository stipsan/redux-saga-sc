/* eslint consistent-return: "off" */

import { delay } from 'redux-saga'
import { call, cps, put, race, take } from 'redux-saga/effects'

export function *handleEmit(socket, {
  event,
  autoReconnectOptions = socket.autoReconnectOptions,
  payload,
}) {
  const { initialDelay, randomness, multiplier, maxDelay } = autoReconnectOptions
  let timeout
  let exponent = 0
  while (true) { // eslint-disable-line no-constant-condition
    try {
      return yield cps([socket, socket.emit], event, payload)
    } catch (err) {
      // @FIXME implement a rethrow if not TimeoutError instead of logging
      if ('console' in global) {
        console.error('catched error during handleEmit', err)
      }

      const initialTimeout = Math.round(initialDelay + (randomness || 0) * Math.random())

      timeout = Math.round(initialTimeout * Math.pow(multiplier, ++exponent))

      if (timeout > maxDelay) {
        timeout = maxDelay
      }

      // @TODO turn into a yield put(sym('SOCKET_TIMEOUT'))
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Socket emit attempt #${exponent} failed, will retry in ${timeout}ms`)
      }

      yield call(delay, timeout)
    }
  }
}

export function *handleRequest(socket, {
  timeout,
  payload: requestAction,
}) {
  const { failureType } = requestAction.payload
  yield put(requestAction)
  try {
    yield call(handleEmit, socket, requestAction)
    const { payload: { successType } } = requestAction
    const { response } = yield race({
      response: take([successType, failureType]),
      timeout: call(delay, timeout),
    })
    if (!response) {
      const error = new Error('Socket request timed out waiting for a response')
      error.name = 'SocketTimeoutError'
      throw error
    }
  } catch (err) {
    yield put({ type: failureType, payload: { error: { name: err.name, message: err.message } } })
  }
}
