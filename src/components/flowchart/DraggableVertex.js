import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import * as newActions from '../../redux/actions'

import { TweenLite } from "gsap"
import * as Draggable from 'gsap/Draggable';

var mapStateToProps = (state, ownProps) => ({
  // controlInputs: Object.keys(state.controls).filter((thisControl) => state.controls[thisControl].controlDirection == 0),
  controls: state.controls,
  startingPointDeviceID: (state.selectedOutput == undefined) ? null : state.selectedOutput.deviceID,
  startingPointControlID: (state.selectedOutput == undefined) ? null : state.selectedOutput.controlID,
  controlID: (state.selectedOutput == undefined) ? null : state.selectedOutput.txDeviceID + '.' + state.selectedOutput.txControlID,
  scale: state.flowchart.scale,
  positions: state.positions,
  lockState: state.flowchart.lockState
})

class DraggableVertex extends React.Component {

  render() {
    const inputs = {
      dragDot: {
        id: 'dragDot',
        cx: 0,
        cy: 0,
        r: 13,
        fill: '#76d0f1',
        onMouseEnter: () => Draggable.get("#deviceContainer").disable(),
        onMouseLeave: () => Draggable.get("#deviceContainer").enable(),
        opacity: 0,
        style: {
          cursor: 'pointer'
        }
      },
      dragVertex: {
        id: 'dragVertex',
        stroke: '#455A64',
        strokeWidth: 3,
        fill: 'none'
      }
    }

    this.initializeDraggable()

    return (
      <g>
        <circle {...inputs.dragDot}/>
        <path {...inputs.dragVertex}/>
      </g>
    )
  }

  initializeDraggable() {

    const outputElement = document.getElementById(this.props.controlID)

    this.setDot()

    Draggable.create("#dragDot", {
      type: 'x, y',
      trigger: outputElement,
      onDrag: () => this.props.lockState ? null : this.updatePath(),
      onDragStart: () => this.props.lockState ? null : this.startDrag(),
      onDragEnd: () => this.props.lockState ? null : this.checkOverlap(),
    })

  }

  setDot() {
     const outputPosition = this.getElementPosition(this.props.controlID)

     TweenLite.set("#dragDot", {
      x: outputPosition.left,
      y: outputPosition.top,
    })

  }

  startDrag() {
    this.props.updateDragging()
    TweenLite.set("#dragVertex", {
      visibility: 'visible'
    })
    TweenLite.set("#dragDot", {
      opacity: 1
    })
  }

  updatePath() {
    const bezierWeight = 0.35
    const dragDotPosition = document.getElementById("dragDot")
    const dragVertexPath = document.getElementById("dragVertex")

    const getOutput = this.getElementPosition(this.props.controlID)

    const x1 = dragDotPosition._gsTransform.x;
    const y1 = dragDotPosition._gsTransform.y;

    const x4 = getOutput.left;
    const y4 = getOutput.top;

    const dx = Math.abs(x1 - x4) * bezierWeight;

    const p1x = x1;
    const p1y = y1;

    const p2x = x1 - dx;
    const p2y = y1;

    const p4x = x4;
    const p4y = y4;

    const p3x = x4 + dx;
    const p3y = y4;

    const data = `M${p1x} ${p1y} C ${p2x} ${p2y} ${p3x} ${p3y} ${p4x} ${p4y}`;

    dragVertexPath.setAttribute("d", data)

  };

  getElementPosition(element) {

    const svgElement = document.getElementById(element)

    if (svgElement == undefined) {
      return  {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    }

    const svgElRect = svgElement.getBoundingClientRect()

    const svgContainer = document.getElementById("deviceContainer")
    const svgConRect = svgContainer.getBoundingClientRect()

    const heightOffset = svgElRect.height / 2
    const widthOffset = svgElRect.width / 2

    const topPosition = svgElRect.top + heightOffset - svgConRect.top
    const leftPosition = svgElRect.left + widthOffset - svgConRect.left

    const returnPosition = {
      top: topPosition / this.props.scale,
      left: leftPosition / this.props.scale,
      bottom: (topPosition + svgElRect.height) / this.props.scale,
      right: (leftPosition + svgElRect.width) / this.props.scale,
    };

    return returnPosition
  };

  calculateOverlap(rect1, rect2) {
    let overlap = false

    if( (rect1 != undefined) && (rect2 != undefined)) {
      overlap = !(rect1.right < rect2.left ||
                  rect1.left > rect2.right ||
                  rect1.bottom < rect2.top ||
                  rect1.top > rect2.bottom)
      }

    return overlap
  }

  checkOverlap() {
    const controlInputs = Object.keys(this.props.controls).filter((thisControl) => this.props.controls[thisControl].controlDirection == 0);
    const dragDotPosition = this.getElementPosition("dragDot")

    for (let i = 0; i < controlInputs.length; i++) {
      let currentInput = controlInputs[i].toString()
      const inputPosition = this.getElementPosition(currentInput)

      if (this.calculateOverlap(dragDotPosition, inputPosition)) {

        const deviceID = this.props.controls[currentInput].deviceID
        const controlID = this.props.controls[currentInput].controlID

        this.props.addVertex(deviceID, controlID)
    }}

    this.resetDrag()
  }

  resetDrag() {
    const dragVertexPath = document.getElementById("dragVertex")

    this.props.updateDragging()

    this.setDot()

    TweenLite.set('#dragVertex', {
      visibility: 'hidden'
    })

    TweenLite.set('#dragDot', {
      opacity: '0'
    })

  };


}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DraggableVertex)
