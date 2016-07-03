import expect from 'expect'
import { takeEvery } from 'redux-saga'

import { EMIT, watchEmits } from '../../src'
import { handleEmit } from '../../src/workers'

describe('watchEmits', () => {
  const socket = { emit() {} }
  const iterator = watchEmits(socket)
  const actual = takeEvery(EMIT, handleEmit, socket)

  it('take every EMIT and pass it to the handleEmit worker', () => {
    expect(
      iterator.next().value
    ).toEqual(
      actual.next().value
    )
    expect(
      iterator.next().value
    ).toEqual(
      actual.next().value
    )
  })
})
