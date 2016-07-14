
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import currentUser from './current_user'
import transaction from './transaction'

export default combineReducers({
  routing,
  current_user: currentUser,
  transaction
})
