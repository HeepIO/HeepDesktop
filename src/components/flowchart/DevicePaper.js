import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import * as newActions from '../../redux/actions'
import Control from './Controls';
import DynamicIcon from './DynamicIcon';
import { Paper, Button, Typography, Grid, Tooltip } from 'material-ui';

import { TweenLite } from "gsap"
import * as Draggable from 'gsap/Draggable';
import ThrowPropsPlugin from '../utilities/ThrowPropsPlugin';

import Device from './Device'

var mapStateToProps = (state, ownProps) => ({
  deviceID: ownProps.DeviceID,
  position: state.positions[ownProps.DeviceID] ? state.positions[ownProps.DeviceID] : {top: 100, left: 100},
  activeState: state.devices[ownProps.DeviceID] ? state.devices[ownProps.DeviceID].active : false,
  scale: state.flowchart.scale,
  lockState: state.flowchart.lockState
})


class DevicePaper extends React.Component {

  constructor(props) {
    super(props)
    this.initialPosition = {top: props.position.top, left: props.position.left};
    this.newPosition = {top:  0, left: 0};
  }

  componentDidMount() {
    this.createDraggable()
    if (this.props.lockState) {
      Draggable.get("#_" + this.props.DeviceID).disable()
    }
    // this.initialPosition = {top: this.props.position.top, left: this.props.position.left};
    this.newPosition = {top: this.props.position.top, left: this.props.position.left};
  }

  calculateNewPosition() {
    const dragElement = document.getElementById("_" + this.props.DeviceID)
    const x1 = dragElement._gsTransform.x
    const y1 = dragElement._gsTransform.y

    this.newPosition = {top: Math.round(this.initialPosition.top + y1), left: Math.round(this.initialPosition.left + x1)}
  }

  sendPositionToServer() {
    this.calculateNewPosition()
		this.props.sendPositionToServer(this.props.deviceID, this.newPosition);
	}

  createDraggable () {
    Draggable.create("#_" + this.props.DeviceID, {
      type: "x,y",
      bounds: "#deviceBounds",
      edgeResistance: 0.9,
      allowContextMenu: true,
      throwProps: true,
      throwResistance: 100000,
      // throwMax: 500,
      onDrag: () => this.props.updateVertex(),
      onThrowUpdate: () => this.props.updateVertex(),
      onDragEnd: () => this.sendPositionToServer(),
      onThrowComplete: () => this.sendPositionToServer(),
    });
  };

	render() {

		const inputs = {
      divContainer: {
        onMouseEnter: () => Draggable.get("#deviceContainer").disable(),
        onMouseLeave: () => Draggable.get("#deviceContainer").enable(),
        style: {
          position: 'absolute',
          top: this.initialPosition.top,
          left: this.initialPosition.left,
        }
      },
			deviceContainer: {
        		style: {
    					backgroundColor: 'white',
    					margin: 10,
    					padding: 3,
              width: 330,
    					cursor: this.props.lockState ? 'default' : '-webkit-grab',
    					position: 'absolute',
    					color: 'black',
              pointerEvents: 'visible',
              opacity: this.props.activeState ? 1.0 : .4,
              borderRadius: 20,
              overflow: 'visible'
				},
			},
		}

		return (
        <div id={"_" + this.props.DeviceID} {...inputs.divContainer}>
					{this.props.activeState ?
					<Paper {...inputs.deviceContainer} ref="device">
							<Device DeviceID={this.props.deviceID}/>
					</Paper> :
					<Tooltip id="tooltip-top" title={'Having trouble communicating with this device. Is it still plugged in?'} placement="top">
						<Paper {...inputs.deviceContainer} ref="device">
								<Device DeviceID={this.props.deviceID}/>
						</Paper>
					</Tooltip>}
				</div>
			);
	}
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicePaper);
