import timeout from './timeout'

let stopStepUpTimeout = timeout()

export function clear() {
  stopStepUpTimeout.clear()
}

export function start({ createdAt, expiresIn, scopes }, store) {
  stopStepUpTimeout.start({ createdAt, expiresIn }, () =>
    store.dispatch({ type: 'stop stepup', payload: scopes }));
}
