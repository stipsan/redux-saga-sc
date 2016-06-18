import { sym } from './utils'

export const REQUEST = sym('REQUEST')

export const socketEmit = () => {

}

export const socketRequest = (payload, event = 'dispatch') => ({
  type: REQUEST,
  event,
  payload,
})
