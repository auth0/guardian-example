
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TransactionActions from '../../actions/transaction'
import App from '../App'
import style from './style.css'
import LockWrapper from '../../components/LockWrapper'
import { browserHistory } from 'react-router'

class StepUp extends Component {

  componentDidMount() {
    this.props.transactionActions.requestStepUp({ scope: this.props.params.scope })
  }

  handleAuthentication({ state, idToken }) {
    this.props.transactionActions.acceptStepUp({
      state,
      stepUpidToken: idToken
    })
  }

  render () {
    const containerId = `lock-step-up-container- + ${_.uniqueId()}`
    const lockOptions = {
      auth: {
        params: {
          state: this.props.stepup.transactionId,
          nonce: this.props.stepup.nonce,
          scope: 'openid nonce',
        },
        redirect: false
      },
      container: containerId
    }

    const showLock = this.props.stepup.transactionId && this.props.stepup.nonce;

    return (<App preload={false}>
      <div className='row'>
        <div className='col-md-4' ref='left'>
          <div className={style['lock-container']}>
            <div id={containerId}>
              <LockWrapper options={lockOptions} handleAuthentication={::this.handleAuthentication} show={showLock}/>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <h2><i className={'glyphicon glyphicon-lock ' + style['icon-left']}></i>Confirm your identity</h2>
          <hr />
          <p>
          You are about to access an administrative area. In order to protect your security we need confirm your identity before
          moving on.
          </p>
        </div>
      </div>
    </App>)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    transactionActions: bindActionCreators(TransactionActions, dispatch)
  }
}

function mapStateToProps(state) {
  return {
    stepup: state.transaction.stepup
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepUp)
