
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TransactionActions from '../../actions/transaction'
import LockWrapper from '../../components/LockWrapper'

class Login extends Component {
  handleAuthentication (authResult) {
    this.props.transactionActions.acceptLogin(authResult)
  }

  render () {
    return (<LockWrapper handleAuthentication={::this.handleAuthentication} show={!this.props.loggedIn && !this.props.loggingIn}/>)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    transactionActions: bindActionCreators(TransactionActions, dispatch)
  }
}

function mapStateToProps (state) {
  return {
    loggedIn: state.transaction.loggedIn,
    loggingIn: state.transaction.loggingIn
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
