import expect from 'expect'
import { delay } from 'redux-saga'
import { call, put, race, take } from 'redux-saga/effects'

import { request } from '../src'
import { handleEmit } from '../src/emit'
import { deadline } from '../src/request'

describe('request', () => {
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
    ackTimeout: 1000,
    emit() {},
  }
  const iterator = request(socket, action, event)

  it('should call handleEmit directly so it waits until receiver report action received', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(handleEmit, socket, action, event)
    )
  })

  it('should start a timeout race', () => {
    expect(
      iterator.next().value
    ).toEqual(
      race({
        response: take([successType, failureType]),
        timeout: call(deadline, socket.ackTimeout),
      })
    )
  })

  it('should throw a SocketTimeoutError if response fails to meet the deadline', () => {
    const requestDeadline = deadline(socket.ackTimeout)
    expect(
      requestDeadline.next().value
    ).toEqual(
      call(delay, socket.ackTimeout)
    )

    expect(() => {
      requestDeadline.next()
    }).toThrow(/request timed out/)
  })

  it('should return the server response if it wins the race', () => {
    const successAction = {
      type: successType,
      payload: {},
    }
    expect(
      iterator.next({ response: successAction }).value
    ).toEqual(
      successAction
    )
  })
})
