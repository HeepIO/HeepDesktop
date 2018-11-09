import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_designer'

import GenericSelect from '../utilities/GenericSelect'
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import {Checkbox, Collapse} from 'material-ui';

var mapStateToProps = (state, ownProps) => ({
  isPinType: state.designer.controls[ownProps.controlID].designerControlType == "Pin",
  controlID: ownProps.controlID,
  systemType: state.designer.systemType,
  controlType: state.designer.controls[ownProps.controlID]['controlType'],
  negativeLogic: state.designer.controls[ownProps.controlID]['pinNegativeLogic'],
  pin: state.designer.controls[ownProps.controlID]['pinNumber'],
  analogOrDigital: state.designer.controls[ownProps.controlID]['analogOrDigital']
})

class DefinePins extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const inputs = {
      pins: {
        title: "Select Pin",
        options: Array.from(Array(30).keys()),
        defaultValue: this.props.pin,
        width: '45%',
        onChange: (value) => {this.props.updateControlPin(this.props.controlID, value)} 
      },
      negativeLogic: {
        style: {
          color: 'white'
        },
        title: 'Use Negative Logic',
        onChange: (e) => {this.props.updateControlPinPolarity(this.props.controlID, e.target.checked)}
      },
      digitalOrAnalog: {
        title: "Digital or Analog",
        options: ["digital", "analog"],
        width:'45%',
        defaultValue: this.props.analogOrDigital,
        onChange: (value) => {this.props.updateControlAnalogOrDigital(this.props.controlID, value)} 
      }
    }
    
    switch (this.props.systemType) {
      case "Arduino" :
      case "ESP8266" :
      case "PoE" :

        return (
          <Collapse in={this.props.isPinType} timeout={750} unmountOnExit>

          <GenericSelect {...inputs.pins}/>
          <GenericSelect {...inputs.digitalOrAnalog}/>
          {this.props.controlType == 0 && (
            <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.negativeLogic}
                    onChange={(event) => {this.props.updateControlPinPolarity(this.props.controlID, event.target.checked)}}
                    value='pin'
                  />
                }
                label='Use Negative Logic'
              />
          )}
          </Collapse>
          )

    default :
      return (<div/>)
    }
    
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DefinePins)