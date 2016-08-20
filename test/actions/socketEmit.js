import expect from 'expect'

import { EMIT, socketEmit } from '../../src/actions'

describe('socketEmit action creator', () => {
  it('should return passed in action as payload', () => {
    const action = {
      type: 'RECEIVE_LIKES',
      payload: {
        likes: [1, 2, 3],
      },
    }
    expect(
      socketEmit(action)
    ).toEqual({
      type: EMIT,
      event: 'dispatch',
      payload: action,
      autoReconnectOptions: undefined,
    })
  })
  it('can customize the event name on the WebSocket', () => {
    const action = {
      type: 'LOOT',
      payload: {
        coins: 10,
      },
    }
    expect(
      socketEmit(action, { event: 'treasurehunt' })
    ).toEqual({
      type: EMIT,
      event: 'treasurehunt',
      payload: action,
      autoReconnectOptions: undefined,
    })
  })
  it('should optionally pass `autoReconnectOptions`', () => {
    const action = {
      type: 'SPAM',
      payload: {
        free: 'money',
      },
    }
    expect(
      socketEmit(action, { autoReconnectOptions: { maxDelay: 1000 } })
    ).toEqual({
      type: EMIT,
      event: 'dispatch',
      payload: action,
      autoReconnectOptions: {
        maxDelay: 1000,
      },
    })
  })
})
