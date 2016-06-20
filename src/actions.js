import { sym } from './utils'

export const EMIT = sym('EMIT')
export const REQUEST = sym('REQUEST')

export const socketEmit = (payload, event = 'dispatch') => ({
  type: EMIT,
  event,
  payload,
})


export const socketRequest = (payload, event = 'dispatch') => ({
  type: REQUEST,
  event,
  payload,
})
