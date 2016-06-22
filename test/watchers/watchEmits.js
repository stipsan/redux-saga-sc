import expect from 'expect'
import { actionChannel, call, take } from 'redux-saga/effects'

import { EMIT, socketEmit, watchEmits } from '../../src'
import { handleEmit } from '../../src/workers'

describe('watchEmits', () => {
  const socket = {
    emit() {},
  }
  const action = {
    type: 'RECEIVE_VIEWER',
  }
  const emitChan = actionChannel(EMIT)
  const iterator = watchEmits(socket)
  it('should create an action channel for emit actions', () => {
    expect(
      iterator.next().value
    ).toEqual(
      emitChan
    )
  })
  it('should take from the channel', () => {
    expect(
      iterator.next(emitChan.ACTION_CHANNEL.pattern).value
    ).toEqual(
      take(emitChan.ACTION_CHANNEL.pattern)
    )
  })

  it('should dispatch a blocking call', () => {
    expect(
      iterator.next(socketEmit(action)).value
    ).toEqual(
      call(handleEmit, socket, action, 'dispatch', 5)
    )
  })
  // doing it in a blocking way helps queue up the buffer if the network goes down
  // reducing the amount of failed emits while we wait for stuff to come back online
  // this behavior might change once real error handling is implemented
})
