import expect from 'expect'

import { sym } from '../src/utils'

describe('utils', () => {
  describe('sym()', () => {
    it('should create a namespaced ActionType constant', () => {
      expect(sym('EMIT_TIMEOUT')).toBe('@@redux-saga-sc/EMIT_TIMEOUT')
    })
  })
})
