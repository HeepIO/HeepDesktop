import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../redux/actions'

var mapStateToProps = (state) => ({})

class DeviceBuilder extends React.Component {
  
  render() {

    var inputs = {
      iframe: {
        style: {
          width: '100%',
          height: window.innerHeight
        },
        src: "https://device-builder.firebaseapp.com/#/",
        frameBorder: 0
      }
    }

    return <iframe {...inputs.iframe}></iframe>
    
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeviceBuilder))

