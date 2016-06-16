import expect from 'expect'

import { createEventChannel } from '../src'

describe('createEventChannel', () => {
  const socket = {
    on(event, listener) {
      this.listener = listener
    },
    off() {
      delete this.listener
    },
    emit(event, data) {
      this.listener(data)
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
})
