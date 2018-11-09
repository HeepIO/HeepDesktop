import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_designer'
import { withRouter } from 'react-router-dom'
import { withTheme } from 'material-ui/styles';

import GenericSelect from '../utilities/GenericSelect'
import GenericTextInput from '../utilities/GenericTextInput'
import RangeOptions from './RangeOptions'
import DefinePins from './DefinePins'

import { Divider, Grid, Button } from 'material-ui'
import { Delete } from 'material-ui-icons';

var mapStateToProps = (state, ownProps) => ({
  thisControl: state.designer.controls[ownProps.controlKey],
  controlName: state.designer.controls[ownProps.controlKey].controlName,
  controlDirection: state.designer.controls[ownProps.controlKey].controlDirection,
  controlType: state.designer.controls[ownProps.controlKey].controlType,
  controlKey: ownProps.controlKey
})

class ControlOptions extends React.Component {

  render () {

    var inputs = {
      controlName: {
        title: "Enter Control Name",
        width: '100%',
        value: this.props.controlName,
        onChange: (value) => {this.props.updateControlName(this.props.controlKey, value)}
      },
      controlType: {
        title: "Control Type",
        width: '45%',
        options: {
          OnOff: 0,
          Range: 1
        },
        defaultValue: this.props.controlType,
        onChange: (value) => {this.props.updateControlType(this.props.controlKey, value)}
      },
      controlDirection: {
        title: "Control Direction",
        width: '45%',
        options: {
          input: 0,
          output: 1
        },
        defaultValue: this.props.controlDirection,
        onChange: (value) => {this.props.updateControlDirection(this.props.controlKey, value)}
      },
      rangeOptions: {
        controlID: this.props.controlKey
      },
      pinOptions: {
        controlID: this.props.controlKey
      }
    }

    return (<Grid container spacing={24} >
              <Divider/>
              <Grid item xs={4}>
                <GenericTextInput {...inputs.controlName}/>
                <Grid container justify='center'>
                  <Button
                    variant='flat'
                    color='secondary'
                    onClick={() => {this.props.deleteControl(this.props.controlKey)}}>
                    <Delete style={{marginRight: 4}} />
                    Remove Control
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <GenericSelect {...inputs.controlDirection}/>
                <GenericSelect {...inputs.controlType}/>
                <RangeOptions {...inputs.rangeOptions}/>
                <DefinePins {...inputs.pinOptions}/>
              </Grid>
            </Grid>
          );
  }

}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(ControlOptions)))
