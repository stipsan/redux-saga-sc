import expect from 'expect'
import { cps } from 'redux-saga/effects'

import { emit } from '../src'

describe('emit', () => {
  const action = { type: 'TEST', payload: { foo: 'bar' } }
  const event = 'dispatch'
  const socket = {
    emit() {},
  }

  it('should do a call to socket.emit with Continuation Passing Style in emit worker', () => {
    const iterator = emit(socket, action, event)
    expect(
      iterator.next().value
    ).toEqual(
      cps([socket, socket.emit], event, action)
    )
  })
})
