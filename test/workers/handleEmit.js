import expect from 'expect'
import { delay } from 'redux-saga'
import { call, cps } from 'redux-saga/effects'

import { handleEmit, socketEmit } from '../../src'

describe('handleEmit', () => {
  const action = { type: 'TEST', payload: { foo: 'bar' } }
  const event = 'dispatch'
  const socket = {
    autoReconnectOptions: {
      initialDelay: 1000, randomness: 1000, multiplier: 1.5, maxDelay: 3000,
    },
    emit() {},
  }
  const iterator = handleEmit(socket, socketEmit(action))
  it('should yield a socket.emit cps effect', () => {
    expect(
      iterator.next().value
    ).toEqual(
      cps([socket, socket.emit], event, action)
    )
  })

  it('should yield a delay if error happens, not smaller than initialDelay', () => {
    expect(
      iterator.throw('error').value.CALL.args[0]
    ).toBeGreaterThanOrEqualTo(
      call(delay, socket.autoReconnectOptions.initialDelay).CALL.args[0]
    )
  })

  it('should yield a delay if error happens, not larger than maxDelay', () => {
    iterator.next()
    expect(
      iterator.throw('error').value.CALL.args[0]
    ).toBeLessThanOrEqualTo(
      call(delay, socket.autoReconnectOptions.maxDelay).CALL.args[0]
    )
  })

  it('should rethrow error if it\'s not an SocketCluster TimeoutError')
})
