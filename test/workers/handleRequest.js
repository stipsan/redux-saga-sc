import expect from 'expect'
import { delay } from 'redux-saga'
import { call } from 'redux-saga/effects'

import { handleRequest, request } from '../../src'

describe('handleRequest', () => {
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
  const iterator = handleRequest(socket, action, event, 1)
  it('should yield the request effect', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(request, socket, action, event)
    )
  })
  it('should retry request if it fails deadline', () => {
    expect(
      iterator.throw('error').value
    ).toEqual(
      call(delay, 2000)
    )
  })
  it('should return failureType with SocketRequestError if too many attempts', () => {
    iterator.next()
    expect(
      iterator.throw('error').value
    ).toContain({
      type: failureType,
    })
  })
  it('should rethrow error if it\'s not an SocketTimeoutError')
  it('should return and end the loop if no error is thrown', () => {
    const successfulIterator = handleRequest(socket, action, event)
    const successAction = {
      type: successType,
      payload: {},
    }
    successfulIterator.next()
    expect(
      successfulIterator.next(successAction).value
    ).toEqual(
      successAction
    )
  })
})
