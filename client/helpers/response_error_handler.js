import * as TransactionActions from '../actions/transaction';

export default function responseErrorHandler ({ dispatch }, err) {
  if (!err || !err.response) {
    console.error(err, err.stack)
    return
  }

  console.log(err.response)

  let authPath = '/login'

  if (err.response && err.response.body && err.response.body.errorCode === 'invalid_stepup') {
    authPath = '/step-up'
  }

  if (err.response.statusCode === 401 || err.response.statusCode === 403) {
    dispatch(TransactionActions.delTransactionState())

    window.location.href = authPath
  }
}
