
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TransactionActions from '../../actions/transaction'

class Login extends Component {
  componentWillMount () {
    this.props.transactionActions.acceptLogin()
  }

  render () {
    return (<div></div>)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    transactionActions: bindActionCreators(TransactionActions, dispatch)
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
