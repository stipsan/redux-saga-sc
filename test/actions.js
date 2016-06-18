import * as actions from '../src/actions'

import expect from 'expect'

describe('Action Creators', () => {
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
      payload: action,
    })
  })
})
