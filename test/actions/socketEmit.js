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
    })
  })
  it('should return `event` with a sensible default that\'s customizable')
  it('should optionally pass `autoReconnectOptions`')
})
