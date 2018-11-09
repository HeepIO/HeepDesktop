import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../redux/actions'

var mapStateToProps = (state) => ({
  
})

class Loading extends React.Component {
  
  render() {
    var inputs = {
      video: {
        src: "../src/serverside/assets/heepwink3_gradient.mov",
        loop: true, 
        autoPlay: true,
        height: 400,
        width: 400,
        id: "loader",
        style: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      }
    }

    return  <video {...inputs.video}/>
           
  }
  
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Loading))

