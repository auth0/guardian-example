import Enrollment from '../Enrollment'
import React, { Component } from 'react'
import style from './style.css'

export default class EnrollmentList extends Component {

  render () {
    const els = this.props.enrollments.map((enrollment) => {
      return (<li className='col-md-6 well well-sm' key={enrollment.id}>
        <Enrollment enrollment={enrollment} handleUnenroll={this.props.handleUnenroll} enabled={this.props.enabled} />
      </li>)
    })

    return els.length
      ? (<ul className='list-unstyled row'>{els}</ul>)
      : (<p>There are no enrollments yet. <button
        className={'btn btn-link ' + style['flat-btn']}
        onClick={this.props.handleEnrollment}
        disabled={!this.props.enabled}>Enroll a new device.</button></p>)
  }
}
