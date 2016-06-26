import { buffers, eventChannel } from 'redux-saga'

export function createEventChannel(socket, event = 'dispatch') {
  return eventChannel(listener => {
    const handleEvent = (action, cb) => {
      // notify the sender that the event is received
      if (typeof cb === 'function') {
        cb()
      }
      listener(action)
    }
    socket.on(event, handleEvent)
    return () => socket.off(event, handleEvent)
  }, buffers.fixed())
}

export function createChannelSubscription(socketOrExchange, channelName) {
  return eventChannel(listener => {
    const handlePublish = (action, cb) => {
      // notify the sender that the event is received
      if (typeof cb === 'function') {
        cb()
      }
      listener(action)
    }
    const channel = socketOrExchange.subscribe(channelName)
    channel.watch(handlePublish)

    return () => channel.unwatch(channelName, handlePublish)
  }, buffers.fixed())
}
