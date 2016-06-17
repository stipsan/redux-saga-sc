import { cps, fork } from 'redux-saga/effects'

export function *handleEmit(socket, action, event = 'dispatch') {
  yield cps([socket, socket.emit], event, action)
}

export function *emit(socket, action, event) {
  yield fork(handleEmit, socket, action, event)
}
