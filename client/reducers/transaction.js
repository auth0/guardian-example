
import { handleActions } from 'redux-actions'

const initialState = {
  domain: null,
  idToken: null,
  error: null,
  loggingIn: false,
  loggedIn: false,
  stepup: {}
}

export default handleActions({
  'configure transaction' (state, action) {
    return {
      ...state,
      domain: action.payload.domain,
      clientId: action.payload.clientId
    }
  },

  'accept transaction state' (state, action) {
    return { ...state,
      ...action.payload
    }
  },

  'start login' (state, action) {
    return { ...state,
      loggingIn: true
    }
  },

  'remove login' (state, action) {
    return { ...state,
      loggedIn: false,
      loggingIn: false
    }
  },

  'complete login' (state, action) {
    return { ...state,
      loggedIn: true,
      loggingIn: false
    }
  },

  'request stepup' (state, action) {
    const scopes = _.filter(state.stepup.scopes, (scope) => {
        return action.payload.scopes.indexOf(scope) < 0
      })
      .concat(action.payload.scopes)

    return {
      ...state,
      stepup: {
        ...state.stepup,
        transactionId: action.payload.transactionId,
        nonce: action.payload.nonce,
        requestedScopes: scopes
      }
    }
  },

  'complete stepup' (state, action) {
    return {
      ...state,
      stepup: {
        ...state.stepup,
        transactionId: null,
        nonce: null,
        scopes: state.stepup.requestedScopes,
        requestedScopes: []
      }
    }
  },

  'stop stepup' (state, action) {
    return {
      ...state,
      stepup: {
        ...state.stepup,
        scopes: _.isArray(action.payload)
          ? _.filter(action.payload.scopes, (scope) => action.payload.indexOf(scope) < 0)
          : []
      }
    }
  },

  'logout' (state, action) {
    return { ...state,
      loggedIn: false,
      loggingIn: false
    }
  },

  'global error' (state, action) {
    return {
      ...state,
      error: action.payload
    }
  },

  'start transaction blocking' (state) {
    return {
      ...state,
      loading: true
    }
  },

  'finish transaction blocking' (state) {
    return {
      ...state,
      loading: false
    }
  }
}, initialState)
