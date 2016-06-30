import * as actions from '../../src/actions'

import expect from 'expect'

describe('socketEmit action creator', () => {
  it('should return passed in action as payload', () => {
    const action = {
      type: 'RECEIVE_LIKES',
      payload: {
        likes: [1, 2, 3],
      },
    }
    expect(
      actions.socketEmit(action)
    ).toEqual({
      type: actions.EMIT,
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
      actions.socketEmit(action, 'treasurehunt')
    ).toEqual({
      type: actions.EMIT,
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
      actions.socketEmit(action, undefined, { maxDelay: 1000 })
    ).toEqual({
      type: actions.EMIT,
      event: 'dispatch',
      payload: action,
      autoReconnectOptions: {
        maxDelay: 1000,
      },
    })
  })
})
