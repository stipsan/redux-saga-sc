/* eslint consistent-return: "off" */

import { delay } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

import { emit } from './emit'
import { request } from './request'

export function *handleEmit(socket, retries = 5, { event, payload }) {
  let i = 0
  for (i; i <= retries; i++) {
    try {
      return yield call(emit, socket, payload, event)
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

export function *handleRequest(socket, retries, timeRemaining, { event, payload: requestAction }) {
  const { failureType } = requestAction.payload
  yield put(requestAction)
  try {
    yield call(request, socket, retries, timeRemaining, requestAction, event)
  } catch (error) {
    yield put({ type: failureType, payload: { error: err } })
  }
}
