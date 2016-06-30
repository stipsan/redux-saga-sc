import { sym } from './utils'

export const EMIT = sym('EMIT')
export const REQUEST = sym('REQUEST')

export const socketEmit = (payload, event = 'dispatch', autoReconnectOptions) => ({
  type: EMIT,
  event,
  autoReconnectOptions,
  payload,
})


export const socketRequest = (payload, event = 'dispatch', autoReconnectOptions, timeout) => ({
  type: REQUEST,
  event,
  autoReconnectOptions,
  timeout,
  payload,
})
