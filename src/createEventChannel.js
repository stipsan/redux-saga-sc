import { eventChannel } from 'redux-saga'

export function createEventChannel(socket, event = 'dispatch') {
  return eventChannel(listener => {
    const handleEvent = (action, cb) => {
      // notify the client that the request is received
      cb()
      listener(action)
    }
    socket.on(event, handleEvent)
    return () => socket.off(event, handleEvent)
  })
}
