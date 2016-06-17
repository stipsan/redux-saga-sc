import expect from 'expect'
import { fork } from 'redux-saga/effects'

import { request } from '../src'
import { handleEmit } from '../src/emit'

describe('request', () => {
  const type = 'SERVER_REQUEST'
  const successType = 'SERVER_SUCCESS'
  const failureType = 'SERVER_FAILURE'
  const action = {
    type,
    payload: {
      successType,
      failureType,
    },
  }
  const event = 'dispatch'
  const socket = {
    emit() {},
  }

  it('should fork emit to handleEmit worker so it does not block', () => {
    const iterator = request(socket, action, event)
    expect(
      iterator.next().value
    ).toEqual(
      fork(handleEmit, socket, action, event)
    )
  })
})
