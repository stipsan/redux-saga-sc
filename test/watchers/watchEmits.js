describe('watchEmits', () => {
  it('should create an action channel for emit actions')
  it('should take from the channel')

  it('should dispatch a blocking call')
  // doing it in a blocking way helps queue up the buffer if the network goes down
  // reducing the amount of failed emits while we wait for stuff to come back online
  // this behavior might change once real error handling is implemented
})
