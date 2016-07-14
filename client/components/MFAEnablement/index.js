import React, { Component } from 'react'
import style from './style.css'

export default class MFAEnablement extends Component {
  handleDisableMFA (e) {
    e.preventDefault()

    this.props.handleDisableMFA()
  }

  handleEnableMFA (e) {
    e.preventDefault()

    this.props.handleEnableMFA()
  }

  render () {
    return (<div className={this.props.enabled ? style.enabled : style.disabled}>
      <div className='row'>
        <div className='col-md-12'>
          <label className={style['enablement-label']}>
            {this.props.enabled ? 'Enabled' : 'Disabled'}
            {this.props.enabled ? (<i className='glyphicon glyphicon-ok'></i>) : (<i className='glyphicon glyphicon-remove'></i>)}
          </label>
          <span className={style['enrollment-text']}>
            Multifactor authentication is currently <b>{this.props.enabled ? 'on' : 'off'}</b>
          </span>
          <div className='pull-right'>
            {this.props.enabled
              ? <button className='btn btn-danger' onClick={::this.handleDisableMFA}>Disable Multifactor Authenticator</button>
              : <button className='btn btn-success' onClick={::this.handleEnableMFA}>Enable Multifactor Authenticator</button>
            }
          </div>
        </div>
      </div>
    </div>)
  }
}
