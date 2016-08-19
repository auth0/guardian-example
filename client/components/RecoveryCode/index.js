import React, { Component } from 'react'
import ReactDOM from 'react-dom';

export default class RecoveryCode extends Component {

  handleRegenerateRecoveryCode (e) {
    e.preventDefault()

    if (confirm('Are you sure you want to regenerate the recovery code?')) {
      this.props.handleRegenerateRecoveryCode({ })
    }
  }

  handleConfirmationChange(confirmed) {
    this.dispatch(mfa.recoveryCodeSavedConfirmationChanged({ confirmed }));
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var element = ReactDOM.findDOMNode(this);

    if (element.setSelectionRange) {
      element.setSelectionRange(0, element.value.length)
    }
  }

  render() {
    return this.props.recoveryCode
      ? <div>
        <p className='alert alert-info'>Your new recovery code is: {this._formatCode(this.props.recoveryCode)}</p>
        <p className='alert alert-warning'>Record this code, it will only be visible now and cannot be retrieved again.  No previous code can be used.</p>
      </div>
      : <div>
        <p>The recovery code can be used to access your account in the event you lose access to your device.</p>
        <p>If you generate a new recovery code the old one will stop working.</p>
        <button className='btn btn-danger pull-right' disabled={!this.props.enabled}
          onClick={::this.handleRegenerateRecoveryCode}>Regenerate Recovery Code</button>
      </div>
  }

  _formatCode(code) {
    if (!code) return ''

    return code.match(/(.{1,4})/g).join(' - ')
  }
}
