
import { handleActions } from 'redux-actions'

const initialState = {
  domain: null,
  idToken: null,
  error: null
}

export default handleActions({
  'configure transaction' (state, action) {
    return {
      ...state,
      domain: action.payload.domain,
      clientId: action.payload.clientId
    }
  },

  'complete login' (state, action) {
    return { ...state,
      loggedIn: true
    }
  },

  'logout' (state, action) {
    return { ...state,
      loggedIn: false
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
