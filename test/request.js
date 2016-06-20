import expect from 'expect'
import { delay } from 'redux-saga'
import { call, race, take } from 'redux-saga/effects'

import { request } from '../src'
import { emit } from '../src/emit'

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

  it('should call emit directly so it waits until receiver report action received', () => {
    expect(
      iterator.next().value
    ).toEqual(
      call(emit, socket, action, event)
    )
  })

  it('should start a timeout race', () => {
    expect(
      iterator.next().value
    ).toEqual(
      race({
        response: take([successType, failureType]),
        timeout: call(delay, socket.ackTimeout / 10),
      })
    )
  })

  it('should throw a SocketTimeoutError if response fails to meet the deadline', () => {
    const requestDeadline = request(socket, action, event)
    requestDeadline.next()
    requestDeadline.next()

    expect(() => {
      requestDeadline.next({ timeout: true })
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
