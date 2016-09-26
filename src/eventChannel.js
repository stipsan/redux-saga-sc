import { buffers, eventChannel } from 'redux-saga'

export function createEventChannel(socket, event = 'dispatch', buffer = buffers.fixed()) {
  return eventChannel((listener) => {
    const handleEvent = (action, cb) => {
      // notify the sender that the event is received
      if (typeof cb === 'function') {
        cb()
      }
      listener(action)
    }
    socket.on(event, handleEvent)
    return () => socket.off(event, handleEvent)
  }, buffer)
}

export function createChannelSubscription(socketOrExchange, channelName, buffer = buffers.fixed()) {
  return eventChannel((listener) => {
    const handlePublish = (action, cb) => {
      // notify the sender that the event is received
      if (typeof cb === 'function') {
        cb()
      }
      listener(action)
    }
    const channel = socketOrExchange.subscribe(channelName)
    channel.watch(handlePublish)

    return () => {
      channel.unwatch(handlePublish)
      // @TODO socketOrExchange.unsubscribe(channelName)
    }
  }, buffer)
}
