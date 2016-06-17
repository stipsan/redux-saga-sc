import expect from 'expect'
import { fork } from 'redux-saga/effects'

import { request } from '../src'
import { handleEmit } from '../src/emit'

describe('emit', () => {
  const action = { type: 'TEST', payload: { foo: 'bar' } }
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
