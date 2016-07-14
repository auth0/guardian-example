import React, { Component } from 'react'
import style from './style.css'

export default class SectionLine extends Component {

  render () {
    return (<div className='row'>
      <div className='col-md-3'>
        <h4 className={style.title}>{this.props.title}</h4>
      </div>
      <div className='pull-right col-md-9'>
        {this.props.children}
      </div>
    </div>)
  }
}
