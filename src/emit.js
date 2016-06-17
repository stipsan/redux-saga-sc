import { cps, fork } from 'redux-saga/effects'

import { sym } from './utils'

export const EMIT_TIMEOUT = sym('EMIT_TIMEOUT')
export const EMIT_ERROR = sym('EMIT_ERROR')

export function *handleEmit(socket, action, event = 'dispatch') {
  yield cps([socket, socket.emit], event, action)
}

export function *emit(socket, action, event) {
  yield fork(handleEmit, socket, action, event)
}
