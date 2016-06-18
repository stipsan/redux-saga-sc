import expect from 'expect'
import { channel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

import { socketRequest } from '../../src/actions'
import { handleRequest, processRequest } from '../../src/workers'

describe('processRequest', () => {
  const socket = {
    emit() {},
  }
  const chan = channel()
  const retries = 3
  const iterator = processRequest(socket, chan, retries)
  const payload = {
    type: 'SERVER_REQUEST',
    payload: {
      successType: 'SERVER_SUCCESS',
      failureType: 'SERVER_FAILURE',
    },
  }
  const action = socketRequest(payload)
  it('should take actions from the request channel', () => {
    expect(
      iterator.next().value
    ).toEqual(
      take(chan)
    )
  })
  it('should put outbound action to stores', () => {
    expect(
      iterator.next(action).value
    ).toEqual(
      put(payload)
    )
  })
  it('should yield a call to handleRequest', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(handleRequest, socket, payload, action.event, retries)
    )
  })
  it('should swallow any errors and put them as failureType', () => {
    expect(
      iterator.throw('error').value
    ).toEqual(
      put({
        type: 'SERVER_FAILURE',
        payload: {
          error: 'error',
        },
      })
    )
  })
})
