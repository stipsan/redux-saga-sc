import * as actions from '../../src/actions'

import expect from 'expect'

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
      actions.socketRequest(payload)
    ).toEqual({
      type: actions.REQUEST,
      event: 'dispatch',
      autoReconnectOptions: undefined,
      timeout: undefined,
      payload,
    })
  })
  it('can customize the event name on the WebSocket', () => {
    expect(
      actions.socketRequest(payload, 'request')
    ).toEqual({
      type: actions.REQUEST,
      event: 'request',
      autoReconnectOptions: undefined,
      timeout: undefined,
      payload,
    })
  })
  it('should optionally pass `autoReconnectOptions`', () => {
    expect(
      actions.socketRequest(payload, undefined, { maxDelay: 1000 })
    ).toEqual({
      type: actions.REQUEST,
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
      actions.socketRequest(payload, undefined, undefined, 1000)
    ).toEqual({
      type: actions.REQUEST,
      event: 'dispatch',
      autoReconnectOptions: undefined,
      timeout: 1000,
      payload,
    })
  })
})
