import React, { Component } from 'react'
import lock from '../../services/lock'

export default class LockWrapper extends Component {

  componentDidMount () {
    this.doShow(this.props.show)
  }

  componentDidUpdate (nextProps) {
    this.doShow(this.props.show)
  }

  handleAuthentication (result) {
    this.props.handleAuthentication(result)
  }

  doShow(show) {
    if (show) {
      if (!this.lock) {
        this.lock = lock(this.props.options)

        this.lock.on('authenticated', ::this.handleAuthentication)
      }

      this.lock.show()
    } else if (this.lock) {
      this.lock.hide()
      this.lock = null;
    }
  }

  render () {
    return null
  }

  componentWillUnmount() {
    this.lock = null
  }
}
