import React from 'react';

import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import * as actions           from '../../redux/actions_classic'

import { withTheme } from 'material-ui/styles'
import { Divider, Typography, Collapse, Tooltip, Button, Menu, TextField } from 'material-ui'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import { Redo, Undo, LinearScale, PowerSettingsNew, ExpandLess, ExpandMore } from 'material-ui-icons'

var mapStateToProps = (state, ownProps) => ({
  thisControl: state.controls[ownProps.controlID],
  valueCurrent: state.controls[ownProps.controlID].valueCurrent
})

class DetailsPanelControlBlock extends React.Component {
  state = {
    view: false,
    anchorEl: null
  }

  render() {

    const buttonSize = 30;

    const inputs = {
      buttons: {
        style: {
          padding: 0,
          height: buttonSize,
          width: buttonSize,
          minWidth: buttonSize
        }
      },
      activeIcons: {
        style: {
          color: this.props.valueCurrent == 1 ? '#03a9f4' : '#7e838a'
        }
      },
      inactiveIcons: {
        style: {
          color: '#7e838a'
        }
      },
    }

    return (  
        <List 
            disablePadding 
            dense
          >
            <ListItem 
              button 
              onClick={() => this.setState({view: !this.state.view})}
              style={{paddingLeft: 4}}>

              {this.controlIcons(inputs)}
              <ListItemText primary={this.props.thisControl.controlName}/>
              {this.state.view ? <ExpandLess /> : <ExpandMore />}

            </ListItem>
            
            <Collapse in={this.state.view} timeout="auto" unmountOnExit>
              <div>

                {Object.keys(this.props.thisControl).map((field) => (
                  this.listField(field, this.props.thisControl[field])
                ))}

              </div>
            </Collapse>
            <Divider/>
          </List>
        
    );
  }


  listField(field, value) {

    return (
      <ListItem key={field} 
        button={field == 'valueCurrent'}
        onClick={(event) => {
          if (field == 'valueCurrent') {
            if (this.props.thisControl.controlType == 0) {
              this.toggleOnOffControl();
            } else {
              this.setState({anchorEl: event.target})
            }
          }
        }}
      > 
        <ListItemText primary={field + ' : '} />
        <Typography >
          {value.toString()}
        </Typography>
      </ListItem>
    )
  }

  controlIcons(inputs) {

    return (
      <div style={{width: 90}}>
        <ListItemIcon>
          {this.props.thisControl.controlDirection == 0 ? 
            <Tooltip id='tooltip-input' title='Input' placement="left" style={{marginRight: 8}}> 
              <Button {...inputs.buttons}>
                <Redo {...inputs.inactiveIcons}/> 
              </Button>
            </Tooltip>: 
            <Tooltip id='tooltip-output' title='Output' placement="left" style={{marginRight: 8}}> 
              <Button {...inputs.buttons}>
                <Undo {...inputs.inactiveIcons}/>
              </Button>
            </Tooltip>}
        </ListItemIcon>
        <ListItemIcon>
          {this.props.thisControl.controlType == 1 ?  
           this.rangeControl(inputs) : 
           this.onOffControl(inputs) }
        </ListItemIcon>

      </div>
    )
  }

  
  rangeControl = (inputs) => (
    <Tooltip id='tooltip-range' title='Range' placement="left"> 
       <Button {...inputs.buttons}
        onClick={(event) => {
          event.stopPropagation();
          this.setState({anchorEl: event.target})
        }}
       >
           <LinearScale {...inputs.activeIcons}/> 
           <Menu
             id="range-menu"
             anchorEl={this.state.anchorEl}
             open={Boolean(this.state.anchorEl)}
             onClose={() => this.setState({anchorEl: null})}
             
           >
            <div style={{padding: 24, textDecoration: 'none',
                  outline: 'none'}}>
              <TextField
                id="value"
                label={this.props.thisControl.controlName + ' Value:'}
                error={this.props.valueCurrent > this.props.thisControl.valueHigh || this.props.valueCurrent < this.props.thisControl.valueLow}
                value={this.props.valueCurrent}
                onChange={ (event) => {
                  this.props.updateControlValue(this.props.thisControl.deviceID, this.props.thisControl.controlID, event.target.value)
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.setState({anchorEl: null})
                    event.preventDefault();
                  }
                }}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{
                  textDecoration: 'none',
                  outline: 'none'
                }}
              />
            </div>
           </Menu>
       </Button>
       
    </Tooltip>
  )

  toggleOnOffControl = () => {
    this.props.updateControlValue(this.props.thisControl.deviceID, this.props.thisControl.controlID, this.props.valueCurrent == 0 ? 1: 0);
  }

  onOffControl = (inputs) => (
    <Tooltip id='tooltip-onoff' title='On/Off' placement="left"> 
       <Button 
           onClick={(event) => {
             event.stopPropagation();
             this.toggleOnOffControl();
           }}
           {...inputs.buttons}
       >
           <PowerSettingsNew {...inputs.activeIcons}/>
       </Button>
    </Tooltip>
  )
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(DetailsPanelControlBlock)))