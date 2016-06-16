import expect, { createSpy } from 'expect'

import { createEventChannel } from '../src'

describe('createEventChannel', () => {
  const socket = {
    on(event, listener) {
      this.listener = listener
    },
    off() {
      delete this.listener
    },
    emit(event, data, cb) {
      this.listener(data, cb)
    },
  }
  const chan = createEventChannel(socket)

  it('should create an event channel', () => {
    const actual = []
    const action = { type: 'TEST', payload: { foo: 'bar' } }

    chan.take((ac) => actual.push(ac))
    socket.emit('dispatch', action)
    expect(actual).toContain(action)
    socket.emit('dispatch', action)
    expect(actual.length).toBe(1, 'eventChannel should only notify once')
  })

  it('should handle delivery notifications', () => {
    const actual = []
    const action = { type: 'TEST', payload: { foo: 'bar' } }
    const spy = createSpy()

    chan.take((ac) => actual.push(ac))
    socket.emit('dispatch', action, spy)
    expect(actual).toContain(action)
    expect(spy).toHaveBeenCalled()
  })
})
