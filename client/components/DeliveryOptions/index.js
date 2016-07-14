import React, { Component } from 'react'

const TEXT_MAP = {
  'authenticator': 'Authenticator Application',
  'pn': 'Guardian Application',
  'sms': 'SMS'
}

export default class DeliveryOptions extends Component {
  render () {
    const enrollment = this.props.enrollments[0]

    if (enrollment) {
      return (<p>Your main delivery option is: <b>{TEXT_MAP[enrollment.type]}</b></p>)
    } else {
      return (<p><b>No enrollments yet.</b></p>)
    }
  }
}
