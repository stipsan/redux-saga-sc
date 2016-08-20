import { sym } from './utils'

export const EMIT = sym('EMIT')
export const REQUEST = sym('REQUEST')

export const socketEmit = (payload, { event, autoReconnectOptions } = {}) => ({
  type: EMIT,
  event: event || 'dispatch',
  autoReconnectOptions,
  payload,
})


export const socketRequest = (
  typeOrPayload, { payload: customPayload, event = 'dispatch', autoReconnectOptions, timeout } = {}
) => {
  let payload = typeOrPayload
  if (typeof payload === 'string') {
    payload = {
      type: `${typeOrPayload}_REQUEST`,
      payload: {
        failureType: `${typeOrPayload}_FAILURE`,
        successType: `${typeOrPayload}_SUCCESS`,
        ...customPayload,
      },
    }
  }
  return {
    type: REQUEST,
    event: event || 'dispatch',
    autoReconnectOptions,
    timeout,
    payload,
  }
}
