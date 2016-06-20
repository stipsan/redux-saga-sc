import expect from 'expect'
import { channel } from 'redux-saga'
import { call, fork, put, take } from 'redux-saga/effects'

import { REQUEST, watchRequests } from '../../src'
import { processRequest } from '../../src/workers'

describe('watchRequests', () => {
  const socket = {
    emit() {},
  }
  const workers = 2
  const retries = 5
  const chan = channel()
  const iterator = watchRequests(socket, workers, retries)
  it('should setup a channel to queue incoming requests', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(channel)
    )
  })
  it('should create 2 worker "threads"', () => {
    expect(
      iterator.next(chan).value
    ).toEqual(
      fork(processRequest, socket, chan, retries)
    )
    expect(
      iterator.next(chan).value
    ).toEqual(
      fork(processRequest, socket, chan, retries)
    )
  })
  it('should take requests and put them on the channel', () => {
    const payload = {
      type: 'REQUEST',
      payload: { successType: 'SUCCESS', failureType: 'FAILURE' },
    }
    expect(
      iterator.next().value
    ).toEqual(
      take(REQUEST)
    )
    expect(
      iterator.next(payload).value
    ).toEqual(
      put(chan, payload)
    )
  })
})
