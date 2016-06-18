import expect from 'expect'
import { call, put, take } from 'redux-saga/effects'

import { createEventChannel, watchRemote } from '../../src'

describe('watchRemote', () => {
  const socket = {
    on(event, listener) {
      this.listener = listener
    },
    off() {
      delete this.listener
    },
    emit(event, data, cb) {
      this.listener(data, cb)
    },
  }
  const chan = createEventChannel(socket)
  const event = 'foo'
  const action = { type: 'RECEIVE_LIKES' }
  const iterator = watchRemote(socket, event)
  it('should create an event channel to queue incoming external requests', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(createEventChannel, socket, event)
    )
  })
  it('should take ation from event channel', () => {
    expect(
      iterator.next(chan).value
    ).toEqual(
      take(chan)
    )
  })
  it('should put the action', () => {
    expect(
      iterator.next(action).value
    ).toEqual(
      put(action)
    )
  })
})
