import React, { Component } from 'react'

export default class RecoveryCode extends Component {
  render () {
    return (<div>
      <div>
        <p>The recovery code can be used to access your account in the event you lose access to your device.</p>
      </div>
      <div className='alert alert-warning clearfix'>
        <p>If you generate a new recovery code the old one will stop working.</p>
        <button className='btn btn-info pull-right' disabled={!this.props.enabled}>Generate new recovery code</button>
      </div>
    </div>)
  }
}
