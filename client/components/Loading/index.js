import React, { Component } from 'react'
import style from './style.css'

export default class Loading extends Component {

  render () {
    return (
      <div className={style['loader-overlay']}>
        <div className={style.loader}></div>
      </div>
    )
  }
}
