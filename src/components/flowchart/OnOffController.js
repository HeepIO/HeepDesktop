import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import { PowerSettingsNew }   from 'material-ui-icons'
import { IconButton }                 from 'material-ui'

const mapStateToProps = (state, ownProps) => ({
  controlID: state.controls[ownProps.thisControl]['controlID'],
  DeviceID: ownProps.DeviceID,
  value: state.controls[ownProps.thisControl]['valueCurrent']
})

class OnOffController extends React.Component {

	sendCommand() {
    var newVal = 0
    if (this.props.value == 0) {
      newVal = 1
    }
	  this.props.updateControlValue(this.props.DeviceID, this.props.controlID, newVal);
	}

	render() {

		var inputs = {
			buttonIcon: {
				style: {
          maxWidth: '100%',
          stroke: (this.props.value == 0) ? 'none' : '#03a9f4',
          fill: (this.props.value == 0) ? 'rgba(0, 0, 0, 0.54)' : '#03a9f4',
          strokeWidth: (this.props.value == 0) ? 0 : 1
        }
			}
		};

		return  (
			<IconButton 	
				onClick={() => this.sendCommand()} 
				style={{
					maxWidth:'100%', 
					borderRadius: 5,
					top: -3, 
					height: 36, 
					width: 80
				}}>
				<PowerSettingsNew {...inputs.buttonIcon}/>
			</IconButton>
		)
	}
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(OnOffController)
