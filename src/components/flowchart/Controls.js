import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import OnOffContainer from './OnOffController'
import RangeContainer from './RangeController'
import { Grid, Typography } from 'material-ui'
import * as Utils from '../../serverside/utilities/generalUtilities'

import * as Draggable from 'gsap/Draggable'
import { TweenLite } from "gsap"

var mapStateToProps = (state, ownProps) => ({
  control: state.controls[ownProps.controlID],
  collapsed: state.flowchart.devices[ownProps.DeviceID] ? state.flowchart.devices[ownProps.DeviceID].collapsed : false,
  deviceID: ownProps.deviceID,
  controlID: ownProps.controlID,
  value: state.controls[ownProps.controlID].valueCurrent,
  isDragging: state.flowchart.isDragging,
  lockState: state.flowchart.lockState,
  showVertices: state.flowchart.showVertices
})

const smallRadius = 12
const largeRadius = 18

class Control extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			radius: smallRadius,
			controlHighlight: 'white',
      		pointerEvents: 'all'
		}
		this.direction = this.props.control['controlDirection'];
		this.leftIndent = this.direction == 0 ? 10 : 250;
	};

	selectOutputVertex() {
		this.props.selectOutput(this.props.deviceID,
								this.props.control['controlID']);
	};

  handleMouseEnter() {
    this.setState({radius: largeRadius});
    this.props.lockState ? null : Draggable.get("#_" + this.props.deviceID).disable()
    this.selectOutputVertex(event)
  };

  handleMouseLeave() {
    this.setState({radius: smallRadius});
    this.props.lockState ? null : Draggable.get("#_" + this.props.deviceID).enable()
  };

	drawControlKnob(ref) {

		const inputs = {
			knobDiv: {
				style: {
					// width: 10,
					top: 5,
					// height: 20,
					position:'absolute',
					right: this.direction == 0 ? null : -largeRadius * 2 - 2,
					left: this.direction == 0 ? -largeRadius * 2 - 2: null
				}
			},
			circleContainer: {
				height: largeRadius * 2,
				width: largeRadius * 2,
        style: {
          // background: 'gray'
        }
			},
			circle: {
        id: this.props.controlID,
        className: 'controlCircle',
        // onMouseEnter: (event) => {(this.direction == 0 && !this.props.dragVertex) ?
				// 					 null : this.handleMouseEnter()},
				onMouseEnter: () => (this.direction == 0 || this.props.isDragging == true) ? this.setState({radius: 11}) : this.handleMouseEnter(),
				onMouseLeave: () => (this.direction == 0) ? this.setState({radius: smallRadius}) : this.handleMouseLeave(),
				cx: this.direction == 0 ? largeRadius*2 : 0,
				cy: largeRadius,
				r: this.state.radius,
				fill: this.direction == 0 ? "#00baff" : '#00cb7b',
				opacity: this.props.showVertices ? 1.0 : 0.25,
				style: {
					cursor: 'pointer',
				}
			}
		}

		return (
			<div {...inputs.knobDiv}>
				<svg {...inputs.circleContainer} ref={ref}>
					<circle {...inputs.circle} />
				</svg>
			</div>
		)
	}

	render() {

		const inputs = {
			all: {
				style: {
					top: 0,
					height: 55,
					position: 'relative',
					width: '100%'
				}
			},
			controlContainer:{
				style: {
					height: 35,
					textAlign: 'center',
					display: 'inline-flex',
					alignItems: 'center',
					left: -20
				}
			},
			controller:{
				updateControlValue: this.props.updateControlValue,
				DeviceID: this.props.deviceID,
				controlID: this.props.controlID,
				thisControl: this.props.controlID
			},
      controlTitle: {
        style: {
          userSelect: 'none',
          paddingRight: this.direction == 0 ? 0 : 4,
        }
      }
		}

		var controller = [];

    console.log()

		return (<div {...inputs.all}>

					<Grid container direction='column' justify='center' alignItems='center' spacing={0}>
						<Grid item xs>
							<Typography {...inputs.controlTitle} variant='body2' align='center' noWrap={true}>
								{this.props.control['controlName']}
							</Typography>
						</Grid>
						<Grid item xs style={{height: 35}}>
							{this.props.control.controlType == 0 ? <OnOffContainer {...inputs.controller}/> : <div style={{width:'80%'}}><RangeContainer {...inputs.controller}/></div> }
						</Grid>
					</Grid>

					{this.direction == 1 ?  this.drawControlKnob('output') : this.drawControlKnob('input')}
				</div>
		);
	}
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Control)
