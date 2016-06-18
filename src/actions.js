import { sym } from './utils'

export const REQUEST = sym('REQUEST')

export const socketEmit = () => {

}

export const socketRequest = action => ({
  type: REQUEST,
  payload: action,
})
