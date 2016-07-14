import React, { Component } from 'react'
import moment from 'moment'

export default class Enrollment extends Component {

  handleUnenroll (e) {
    e.preventDefault()

    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.props.handleUnenroll({ enrollmentId: this.props.enrollment.id })
    }
  }

  render () {
    const enrollment = this.props.enrollment

    return (<div>
      <div>
        <p><b>Status: </b><span>{enrollment.status}</span></p>
        {enrollment.type && <p><b>Type: </b><span>{enrollment.type}</span></p>}
        {enrollment.enrolled_at && <p><b>Enrolled at: </b><span>{moment(enrollment.enrolled_at).format('lll')}</span></p>}
        {enrollment.last_auth && <p><b>Last auth: </b><span>{moment(enrollment.last_auth).format('lll')}</span></p>}
      </div>
      <div>
        <button className='btn btn-danger pull-right' disabled={!this.props.enabled} onClick={::this.handleUnenroll}>Unenroll</button>
      </div>
    </div>)
  }
}
