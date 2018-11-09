import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions'
import { NavLink, withRouter } from 'react-router-dom';


var mapStateToProps = (state, ownProps) => ({
  thisDeviceID: ownProps.thisDeviceID,
  identity: state.devices_firebase[ownProps.thisDeviceID],
  displayingAnalytics: state.displayingAnalytics
})

class DeviceCardWithButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: false
    }
  }

  render () {


    var inputs = {
      thisDevice: {
        deviceID: this.props.thisDeviceID,
        key: this.props.thisDeviceID,
        zoom: 0.5,
        textColor: "white"
      },
      button: {
        style: {
          border: (this.state.selected || this.props.displayingAnalytics == this.props.thisDeviceID) ? "2px solid #dbdfdf" : "2px solid #004a8f",
          cursor: "pointer"
        },
        onClick: () => {this.props.selectDeviceToDisplay(this.props.thisDeviceID)},
        onMouseEnter: () => this.setState({selected: true}),
        onMouseLeave: () => this.setState({selected: false})
      }
    }

    return (
      <div {...inputs.button}>
      
     </div>
    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeviceCardWithButton))
