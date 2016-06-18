import expect from 'expect'
import { cps, fork } from 'redux-saga/effects'

import { emit } from '../src'
import { callEmit } from '../src/emit'

describe('emit', () => {
  const action = { type: 'TEST', payload: { foo: 'bar' } }
  const event = 'dispatch'
  const socket = {
    emit() {},
  }

  it('should fork emit to callEmit worker so it does not block', () => {
    const iterator = emit(socket, action, event)
    expect(
      iterator.next().value
    ).toEqual(
      fork(callEmit, socket, action, event)
    )
  })

  it('should do a call to socket.emit with Continuation Passing Style in callEmit worker', () => {
    const iterator = callEmit(socket, action, event)
    expect(
      iterator.next().value
    ).toEqual(
      cps([socket, socket.emit], event, action)
    )
  })
})
