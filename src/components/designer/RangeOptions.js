import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_designer'

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { Collapse } from 'material-ui'
import GenericTextInput from '../utilities/GenericTextInput'

var mapStateToProps = (state, ownProps) => ({
  isRange: state.designer.controls[ownProps.controlID]["controlType"] == 1,
  controlID: ownProps.controlID,
  currentMax: state.designer.controls[ownProps.controlID]["highValue"],
  currentMin: state.designer.controls[ownProps.controlID]["lowValue"]
})

class RangeOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

      return (
        <Collapse in={this.props.isRange} timeout={750} unmountOnExit>
          
          <GenericTextInput 
            width='45%'
            title='Range Min'
            value={this.props.currentMin}
            onChange={(value) => {this.props.updateControlMin(this.props.controlID, value)}}
          />
          <GenericTextInput 
            width='45%'
            title='Range Max'
            value={this.props.currentMax}
            onChange={(value) => {this.props.updateControlMax(this.props.controlID, value)}}
          />
        </Collapse>)

    
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeOptions)