import React, { Component } from 'react'

export default class User extends Component {

  render () {
    return (<div>
      <h2 className='text-success'>Welcome{this.props.user.name ? ` ${this.props.user.name}` : ''}! You've just logged in using Guardian.</h2>
      <pre>
        {JSON.stringify(this.props.user, null, 2)}
      </pre>
    </div>)
  }
}
