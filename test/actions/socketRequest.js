import expect from 'expect'

import { REQUEST, socketRequest } from '../../src/actions'

describe('socketRequest action creator', () => {
  const payload = {
    type: 'SERVER_REQUEST',
    payload: {
      successType: 'SERVER_SUCCESS',
      failureType: 'SERVER_FAILURE',
    },
  }
  it('should return passed in action as payload', () => {
    expect(
      socketRequest(payload)
    ).toEqual({
      type: REQUEST,
      event: 'dispatch',
      autoReconnectOptions: undefined,
      timeout: undefined,
      payload,
    })
  })
  it('can customize the event name on the WebSocket', () => {
    expect(
      socketRequest(payload, { event: 'request' })
    ).toEqual({
      type: REQUEST,
      event: 'request',
      autoReconnectOptions: undefined,
      timeout: undefined,
      payload,
    })
  })
  it('should optionally pass `autoReconnectOptions`', () => {
    expect(
      socketRequest(payload, { autoReconnectOptions: { maxDelay: 1000 } })
    ).toEqual({
      type: REQUEST,
      event: 'dispatch',
      autoReconnectOptions: {
        maxDelay: 1000,
      },
      timeout: undefined,
      payload,
    })
  })
  it('should optionally pass a request `timeout`', () => {
    expect(
      socketRequest(payload, { timeout: 1000 })
    ).toEqual({
      type: REQUEST,
      event: 'dispatch',
      autoReconnectOptions: undefined,
      timeout: 1000,
      payload,
    })
  })
  it('should create payload and type if first argument is a string', () => {
    expect(
      socketRequest('FETCH_USERS', { payload: { page: 1 } })
    ).toEqual({
      type: REQUEST,
      event: 'dispatch',
      autoReconnectOptions: undefined,
      timeout: undefined,
      payload: {
        type: 'FETCH_USERS_REQUEST',
        payload: {
          successType: 'FETCH_USERS_SUCCESS',
          failureType: 'FETCH_USERS_FAILURE',
          page: 1,
        },
      },
    })
  })
})
