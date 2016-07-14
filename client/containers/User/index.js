
import React, { Component } from 'react'
import { connect } from 'react-redux'
import App from '../App'
import RawUserProfile from '../../components/RawUserProfile'

class User extends Component {

  render () {
    return (<App>
      <RawUserProfile user={this.props.user} />
    </App>)
  }
}

function mapStateToProps (state) {
  return {
    user: state.current_user
  }
}

export default connect(
  mapStateToProps,
  null
)(User)

