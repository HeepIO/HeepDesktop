import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../redux/actions'
import Loading from '../Loading'

var mapStateToProps = (state) => ({
  loginStatus: state.loginStatus
})

class Auth extends React.Component {

  componentDidMount() {
    this.props.loginToFirebase();
  }

  render() {
    
    if (this.props.loginStatus) {

      return <div>Logged in Success!</div>

    } else {
    
      return  ( <div> 
                  <div id="firebaseui-auth-container"></div>
                  <Loading/>
                </div>);
    }

  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth))

