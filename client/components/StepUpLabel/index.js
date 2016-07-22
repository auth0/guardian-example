import React, { Component } from 'react'
import style from './style.css'

export default class StepUpLabel extends Component {

  render () {
    const scopes = this.props.scopes || []

    const enabled = !!scopes.length

    return (<div className={ style['stepup-label'] + ' ' + (enabled ? style['stepup-label-enabled'] : style['stepup-label-disabled'])}>
      <i className='glyphicon glyphicon-flash'></i>
      {enabled
        ? <span className={style['stepup-label-title']}>Sudo mode enabled</span>
        : <span className={style['stepup-label-title']}>Sudo mode disabled</span>}
    </div>)
  }
}
