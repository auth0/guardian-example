/* global confirm */

import React from 'react'
import Code from './code'

function confirmRegeneration(handleRegenerateRecoveryCode) {
  return function confirmAndRegenerate() {
    if (confirm('Are you sure you want to regenerate the recovery code?')) {
      handleRegenerateRecoveryCode()
    }
  }
}

function displayRegenerateDiv(handleRegenerateRecoveryCode, enabled) {
  return (<div>
    <p>
      The recovery code can be used to access your account in the event you lose
      access to your device.
    </p>
    <p>If you generate a new recovery code the old one will stop working.</p>
    <button
      className='btn btn-danger pull-right' disabled={!enabled}
      onClick={confirmRegeneration(handleRegenerateRecoveryCode)}
    >Regenerate Recovery Code</button>
  </div>)
}

function displayCode(recoveryCode) {
  return (<div>
    <p className='alert alert-info'>
      Your new recovery code is: <Code recoveryCode={recoveryCode} />
    </p>
    <p className='alert alert-warning'>
      Record this code, it will only be visible now and cannot be retrieved again.
      No previous code can be used.
    </p>
  </div>)
}

export default function RecoveryCode({ recoveryCode, enabled, handleRegenerateRecoveryCode }) {
  return recoveryCode
    ? displayCode(recoveryCode)
    : displayRegenerateDiv(handleRegenerateRecoveryCode, enabled)
}

RecoveryCode.propTypes = {
  handleRegenerateRecoveryCode: React.PropTypes.func.isRequired,
  recoveryCode: React.PropTypes.string,
}
