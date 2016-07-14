
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TransactionActions from '../../actions/transaction'
import App from '../App'
import style from './style.css'

class StepUpShower extends Component {

  componentDidMount () {
    this.props.initialize()
  }

  componentDidUpdate () {
    this.props.initialize()
  }

  render () {
    return (<div id='lock-step-up-container' ref='el'></div>)
  }
}

class StepUp extends Component {

  render () {
    return (<App preload={false}>
      <div className='row'>
        <div className='col-md-4' ref='left'>
          <div className={style['lock-container']}>
            <StepUpShower initialize={::this.props.transactionActions.stepUp} />
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

export default connect(
  null,
  mapDispatchToProps
)(StepUp)
