import { cps } from 'redux-saga/effects'

export function *emit(socket, action, event = 'dispatch') {
  yield cps([socket, socket.emit], event, action)
}
