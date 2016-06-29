import * as actions from '../../src/actions'

import expect from 'expect'

describe('Action Creators', () => {
  it('should create a socketEmit action with required arguments', () => {
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
  it('should let you create a socket request action', () => {
    const action = {
      type: 'SERVER_REQUEST',
      payload: {
        successType: 'SERVER_SUCCESS',
        failureType: 'SERVER_FAILURE',
      },
    }
    expect(
      actions.socketRequest(action)
    ).toEqual({
      type: actions.REQUEST,
      event: 'dispatch',
      payload: action,
    })
  })
})
