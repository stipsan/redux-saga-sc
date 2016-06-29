import { cps } from 'redux-saga/effects'

export function *emit(socket, event, action) {
  yield cps([socket, socket.emit], event, action)
}
