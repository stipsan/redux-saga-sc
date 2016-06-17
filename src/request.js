import { fork } from 'redux-saga/effects'

import { handleEmit } from './emit'

export function *request(socket, action, event) {
  yield fork(handleEmit, socket, action, event)
}
