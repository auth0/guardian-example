
export default function responseErrorHandler (err) {
  if (!err || !err.response) {
    console.error(err, err.stack)
    return
  }

  console.log(err.response)

  let authPath = '/login'

  if (window.location.pathname === '/step-up') {
    authPath = '/step-up'
  }

  if (err.response.statusCode === 401 || err.response.statusCode === 403) {
    window.location.href = authPath
  }
}
