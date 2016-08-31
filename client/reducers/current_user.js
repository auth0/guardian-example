
import { handleActions } from 'redux-actions'
import _ from 'lodash'

const initialState = {
  loading: false,
  user_metadata: { use_mfa: true },
}

export default handleActions({
  'change mfa status' (state, action) {
    return {
      ...state,
      user_metadata: {
        ...state.user_metadata,
        use_mfa: action.payload
      }
    }
  },

  'read current user' (state, action) {
    return {
      ...state,
      ...action.payload,
      loaded: true,
      loading: false
    }
  },

  'start read current user' (state, action) {
    return {
      ...state,
      loaded: false,
      loading: true
    }
  },

  'delete mfa enrollment' (state, action) {
    return {
      ...state,
      guardian: {
        ...state.guardian,
        enrollments: _.reject(state.guardian.enrollments, (e) => e.id === action.payload.enrollmentId)
      }
    }
  },

  'receive mfa recovery code' (state, action) {
    return {
      ...state,
      recoveryCode: action.payload,
    }
  },
}, initialState)
