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

import { Divider, Grid, Button, Collapse } from 'material-ui'
import { Delete } from 'material-ui-icons';

import ControlOptions from './ControlOptions'

var mapStateToProps = (state) => ({
  isCustomApplication: state.designer.applicationName == "Custom",
  numControls: state.designer.numControls,
  controls: Object.keys(state.designer.controls)
})

class ControlBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selection: "Select..."
    }
  }


  render () {

    var inputs = {
      fieldInputs: {
        style: {
          width: "100%",
          margin: "auto"
        }
      },
      addNewControl: {
        title: "Add New Control",
        value:this.state.selection,
        defaultValue: this.state.selection,
        width: '33%',
        options: ["Virtual", "Pin", "Select..."],
        onChange: (value) => {this.setState({selection: "Select..."}); this.props.addNewControl(value); },
      },
      spacer: {
        style: {
          height: 20
        }
      }
    }

    return (
      <div style={{margin:24}}>
        <Collapse in={this.props.isCustomApplication} timeout={750} unmountOnExit>
          <div {...inputs.fieldInputs}>
            {this.props.controls.map((key) => <ControlOptions controlKey={key} key={key}/>)}  
          </div>
          <div {...inputs.spacer}/>
          <GenericSelect {...inputs.addNewControl}/>
        </Collapse> 
      </div>
         
    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(ControlBuilder)))
