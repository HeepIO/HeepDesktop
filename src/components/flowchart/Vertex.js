import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import * as generalUtils from '../../serverside/utilities/generalUtilities'

var mapStateToProps = (state, ownProps) => (
{
  id: ownProps.vertexID,
  vertex: state.vertexList[ownProps.vertexID],
  positions: state.positions,
  activeState:  state.devices[state.vertexList[ownProps.vertexID].rxDeviceID] &&
                state.devices[state.vertexList[ownProps.vertexID].txDeviceID] &&
                state.devices[state.vertexList[ownProps.vertexID].rxDeviceID].active &&
                state.devices[state.vertexList[ownProps.vertexID].txDeviceID].active,
  updateVertex: state.flowchart.updateVertex,
  display: state.vertexList[ownProps.vertexID].timeSinceDiscovered <= 1 && state.flowchart.showVertices, //(state.flowchart.showVertices || !state.flowchart.lockState),
  dragging: state.flowchart.dragVertex,
  scale: state.flowchart.scale,
  txDeviceID: state.vertexList[ownProps.vertexID].txDeviceID,
  rxDeviceID: state.vertexList[ownProps.vertexID].rxDeviceID,
  txCollapsed: state.flowchart.devices[state.vertexList[ownProps.vertexID].txDeviceID] &&
               state.flowchart.devices[state.vertexList[ownProps.vertexID].txDeviceID].collapsed ?
               state.flowchart.devices[state.vertexList[ownProps.vertexID].txDeviceID].collapsed :
               false,
  rxCollapsed: state.flowchart.devices[state.vertexList[ownProps.vertexID].rxDeviceID] && state.flowchart.devices[state.vertexList[ownProps.vertexID].rxDeviceID].collapsed ? state.flowchart.devices[state.vertexList[ownProps.vertexID].rxDeviceID].collapsed : false,
  lockState: state.flowchart.lockState
})

class Vertex extends React.Component {
	constructor() {
		super();
		this.state = {
			color: '#455a64',
			strokeWidth: 3,
      collapsedColor: '#9fa1a2'
		}
	}

	sendDeleteVertexToServer() {
		this.props.deleteVertex(this.props.id, this.props.vertex)
	};

  getInputPosition = () => {
  	let returnPosition = false;
  	try {

      let txControlName

      if (this.props.txCollapsed == true) {
        txControlName = this.props.txDeviceID + "_tx"
      } else {
        txControlName = generalUtils.getTxControlNameFromVertex(this.props.vertex)
      }

      const svgElement = document.getElementById(txControlName)
      const svgElRect = svgElement.getBoundingClientRect()

      const svgContainer = document.getElementById("deviceContainer")
      const svgConRect = svgContainer.getBoundingClientRect()

      const heightOffset = svgElRect.height / 2
      const widthOffset = svgElRect.width / 2

      returnPosition = {
        top: (svgElRect.top + heightOffset - svgConRect.top) / this.props.scale,
        left: (svgElRect.left + widthOffset - svgConRect.left) / this.props.scale,
      };

  	} catch(err){
  	  }

  	return returnPosition
  };

  getOutputPosition = () => {
  	let returnPosition = false;
  	try {

      let rxControlName

      if (this.props.rxCollapsed == true) {
        rxControlName = this.props.rxDeviceID + "_rx"
      } else {
        rxControlName = generalUtils.getRxControlNameFromVertex(this.props.vertex)
      }

      const svgElement = document.getElementById(rxControlName)
      const svgElRect = svgElement.getBoundingClientRect()

      const svgContainer = document.getElementById("deviceContainer")
      const svgConRect = svgContainer.getBoundingClientRect()

      const heightOffset = svgElRect.height / 2
      const widthOffset = svgElRect.width / 2

      returnPosition = {
        top: (svgElRect.top + heightOffset - svgConRect.top) / this.props.scale,
        left: (svgElRect.left + widthOffset - svgConRect.left) / this.props.scale,
      }

  	} catch(err){
  		//console.log('Found a dangling vertex: ', state.vertexList[ownProps.vertexID]);
  	}

  	return returnPosition
  };

  checkEnabled() {
    if (this.props.rxCollapsed || this.props.txCollapsed || this.props.lockState) {
      return true
    } else {
      return false
    }
  }

	render() {
    const bezierWeight = 0.35

    const getInput = this.getInputPosition();
    const getOutput = this.getOutputPosition();

    const x1 = getInput.left;
    const y1 = getInput.top;

    const x4 = getOutput.left;
    const y4 = getOutput.top;

    const dx = Math.abs(x1 - x4) * bezierWeight;

    const x2 = x1 + dx;
    const y2 = y1;

    const x3 = x4 - dx;
    const y3 = y4;

    const data = `M${x1} ${y1} C ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`;

		if (!this.props.display || getInput == false || getOutput == false) {
      // console.log("false")
			return <g/>
		}

		var inputs = {

			vertex: {
        id: this.props.id,
        pointerEvents: 'all',
        display: 'inline-block',
				strokeWidth: this.state.strokeWidth,
				stroke: this.checkEnabled() ? this.state.collapsedColor : this.state.color,
				fill: 'transparent',
        d: data,
				onMouseEnter: () => this.checkEnabled() ? this.setState({'strokeWidth': 3}) : this.setState({'color': '#d40000', 'strokeWidth': 5}),
				onMouseLeave: () => this.checkEnabled() ? this.setState({'strokeWidth': 3}) : this.setState({'color': '#455a64', 'strokeWidth': 3}),
				onClick: () => this.checkEnabled() ? null : this.sendDeleteVertexToServer(),
				style: {
					cursor: this.checkEnabled() ? 'move' : 'pointer',
          opacity: this.props.activeState ? 1.0 : 0.2
				}
			}
		}
		return <path {...inputs.vertex}/>
	}
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Vertex)
