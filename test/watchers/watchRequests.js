import expect from 'expect'
import { takeEvery } from 'redux-saga'

import { REQUEST, watchRequests } from '../../src'
import { handleRequest } from '../../src/workers'

describe('watchRequests', () => {
  const socket = { emit() {} }
  const iterator = watchRequests(socket)
  const actual = takeEvery(REQUEST, handleRequest, socket)

  it('take every REQUEST and pass it to the handleRequest worker', () => {
    expect(
      iterator.next().value
    ).toEqual(
      actual.next().value
    )
    expect(
      iterator.next().value
    ).toEqual(
      actual.next().value
    )
  })
})
