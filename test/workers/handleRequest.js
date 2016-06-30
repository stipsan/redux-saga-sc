import expect from 'expect'
import { delay } from 'redux-saga'
import { call, put, race, take } from 'redux-saga/effects'

import { handleEmit, handleRequest, socketRequest } from '../../src'

describe('handleRequest', () => {
  const type = 'SERVER_REQUEST'
  const successType = 'SERVER_SUCCESS'
  const failureType = 'SERVER_FAILURE'
  const socket = {
    emit() {},
    ackTimeout: 100,
  }
  const action = socketRequest({
    type,
    payload: {
      successType,
      failureType,
    },
  }, undefined, undefined, 100)
  const { payload } = action
  const { timeout, ...requestAction } = action

  const iterator = handleRequest(socket, action)
  it('should put the payload on the store', () => {
    expect(
      iterator.next().value
    ).toEqual(
      put(payload)
    )
  })
  it('should ask handleEmit to send the request payload trough socket', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(handleEmit, socket, requestAction)
    )
  })
  it('should start a timeout race', () => {
    expect(
      iterator.next().value
    ).toEqual(
      race({
        response: take([successType, failureType]),
        timeout: call(delay, timeout),
      })
    )
  })
  it('should put a failureType action on the redux store on timeout', () => {
    expect(
      iterator.next({ timeout: true }).value
    ).toEqual(
      put({
        type: failureType,
        payload: {
          error: {
            name: 'SocketTimeoutError',
            message: 'Socket request timed out waiting for a response',
          },
        },
      })
    )
  })
})
