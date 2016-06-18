import expect from 'expect'
import { delay } from 'redux-saga'
import { call } from 'redux-saga/effects'

import { handleEmit } from '../../src'
import { emit } from '../../src/emit'

describe('handleEmit', () => {
  const action = { type: 'TEST', payload: { foo: 'bar' } }
  const event = 'dispatch'
  const socket = {
    emit() {},
  }
  const iterator = handleEmit(socket, action, event, 1)
  it('should yield the emit effect', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(emit, socket, action, event)
    )
  })

  it('should retry emit if an error happened', () => {
    expect(
      iterator.throw('error').value
    ).toEqual(
      call(delay, 2000)
    )
  })

  it('should throw if retried too many times', () => {
    iterator.next()
    expect(() => {
      iterator.throw('error')
    }).toThrow(/emit failed 2 times/)
  })

  it('should rethrow error if it\'s not an SocketCluster TimeoutError')

  it('should return and end the loop if no error is thrown')
})
