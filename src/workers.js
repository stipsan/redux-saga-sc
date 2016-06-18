/* eslint consistent-return: "off" */

import { delay } from 'redux-saga'
import { call } from 'redux-saga/effects'

import { emit } from './emit'
import { request } from './request'

export function *handleEmit(socket, action, event = 'dispatch', retries = 5) {
  let i = 0
  for (i; i <= retries; i++) {
    try {
      return yield call(emit, socket, action, event)
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

export function *handleRequest(socket, action, event = 'dispatch', retries = 5) {
  let i = 0
  for (i; i <= retries; i++) {
    try {
      return yield call(request, socket, action, event)
    } catch (err) {
      if (i < retries) {
        yield call(delay, 2000)
      } else {
        const error = new Error(`Socket request failed ${i} times. Giving up.`)
        error.name = 'SocketRequestError'
        const { payload: { failureType } } = action
        return {
          type: failureType,
          payload: { error },
        }
      }
    }
  }
}
