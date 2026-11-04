
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CurrentUserActions from '../../actions/current_user'
import MFAConfigurationPane from '../../components/MFAConfigurationPane'
import App from '../App'
import { browserHistory } from 'react-router'

class Configuration extends Component {
  componentDidMount() {
    const requestedScope = 'update:mfa_settings';

    setTimeout(() => {
      if (this.props.stepupScopes.indexOf(requestedScope) < 0) {
        browserHistory.push(`/step-up/${encodeURIComponent(requestedScope)}`)
      }
    }, 0)
  }

  handleEnableMFA () {
    this.props.userActions.changeMFAStatus(true)
  }

  handleDisableMFA () {
    this.props.userActions.changeMFAStatus(false)
  }

  handleUnenroll ({ enrollmentId }) {
    this.props.userActions.unenrollAsync({ enrollmentId })
  }

  handleEnrollment () {
    this.props.userActions.enrollDevice()
  }

  handleRegenerateRecoveryCode (e) {
    this.props.userActions.regenerateRecoveryCodeAsync()
  }

  render () {
    return (<App>
      <MFAConfigurationPane
        enabled={this.props.use_mfa}
        enrollments={this.props.enrollments || []}
        recoveryCode={this.props.recoveryCode}
        handleEnableMFA={this.handleEnableMFA.bind(this)}
        handleDisableMFA={this.handleDisableMFA.bind(this)}
        handleUnenroll={this.handleUnenroll.bind(this)}
        handleEnrollment={this.handleEnrollment.bind(this)}
        handleRegenerateRecoveryCode={this.handleRegenerateRecoveryCode.bind(this)}
      />
    </App>)
  }
}

function mapStateToProps (state) {
  return {
    use_mfa: state.current_user.user_metadata.use_mfa !== false,
    enrollments: state.current_user.guardian && state.current_user.guardian.enrollments || [],
    recoveryCode: state.current_user.recoveryCode,
    stepupScopes: state.transaction.stepup.scopes || []
  }
}

function mapDispatchToProps (dispatch) {
  return {
    userActions: bindActionCreators(CurrentUserActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Configuration)
