import React, { Component } from 'react'
import SectionLine from '../SectionLine'
import EnrollmentList from '../EnrollmentList'
import DeliveryOptions from '../DeliveryOptions'
import MFAEnablement from '../MFAEnablement'
import RecoveryCode from '../RecoveryCode'
import style from './style.css'

export default class Enrollment extends Component {

  handleUnenroll (e) {
    e.preventDefault()
  }

  render () {
    const mainEnrollment = (this.props.enrollments || [])[0]

    // <hr className={style.separation} />
    // <SectionLine title='Recovery code'>
    //   <RecoveryCode enrollment={mainEnrollment} enabled={this.props.enabled} />
    // </SectionLine>
    return (<div>
      <div className='row'>
        <div className='col-md-12'>
          <h2>Second factor configuration</h2>
          <p>
            Two-factor authentication, or 2FA, let's you logging requiring more than just a password.
            Using only a password (something you know) to log in is susceptible to security threats, because it represents a
            single piece of information a malicious person needs to acquire.

            Using MFA provides a better protection because, apart from something you know (your password),
            the bad guys would also need something you have (a device from where you get a code, or accept a notification).
          </p>
          <hr className={style.separation} />
        </div>
      </div>
      <div className='col-md-12'>
        <MFAEnablement enabled={this.props.enabled} handleDisableMFA={::this.props.handleDisableMFA} handleEnableMFA={::this.props.handleEnableMFA} />
        <hr className={style.separation} />
        <SectionLine title='Enrollments'>
          <EnrollmentList enrollments={this.props.enrollments || []} enabled={this.props.enabled} handleUnenroll={this.props.handleUnenroll} handleEnrollment={this.props.handleEnrollment} />
        </SectionLine>
        <hr className={style.separation} />
        <SectionLine title='Delivery options'>
          <DeliveryOptions enrollments={this.props.enrollments || []} enabled={this.props.enabled} />
        </SectionLine>
      </div>
    </div>)
  }
}
