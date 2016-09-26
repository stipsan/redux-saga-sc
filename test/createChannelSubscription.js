import expect, { createSpy } from 'expect'

import { createChannelSubscription } from '../src'

describe('createChannelSubscription', () => {
  const exchange = {
    channels: {},

    subscribe(channelName) {
      const channel = {
        watch(listener) {
          this.listener = listener
        },
        unwatch(listener) {
          if (this.listener === listener) {
            delete this.listener
          }
        },
      }
      this.channels[channelName] = channel
      return channel
    },
    publish(channelName, data, cb) {
      this.channels[channelName].listener(data, cb)
    },
  }
  const chan = createChannelSubscription(exchange, 'public')

  it('should create an event channel', () => {
    const actual = []
    const action = { type: 'TEST', payload: { foo: 'bar' } }

    chan.take(ac => actual.push(ac))
    exchange.publish('public', action)
    expect(actual).toContain(action)
    exchange.publish('public', action)
    expect(actual.length).toBe(1, 'eventChannel should only notify once')
  })

  it('should handle callbacks', () => {
    const actual = []
    const action = { type: 'TEST', payload: { foo: 'bar' } }
    const spy = createSpy()

    chan.take(ac => actual.push(ac))
    exchange.publish('public', action, spy)
    expect(actual).toContain(action)
    expect(spy).toHaveBeenCalled()
  })

  it('should handle chan.close()', () => {
    expect(exchange.channels.public.listener).toBeTruthy()
    chan.close()
    expect(exchange.channels.public.listener).toBeFalsy()
  })

  it('should buffer messages on the eventChannel')
})
