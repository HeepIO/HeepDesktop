import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../redux/actions'
import { List,
         ListItem, 
         ListItemText, 
         ListItemIcon, 
         ListItemSecondaryAction, 
         IconButton,
         Tooltip,
         Divider,
         Collapse }                 from 'material-ui'
import { withTheme }                from 'material-ui/styles'
import {  ExpandLess, 
          ExpandMore, 
          Redo,
          Undo,
          LinearScale,
          PowerSettingsNew }   from 'material-ui-icons'

var mapStateToProps = (state, ownProps) => ({
  device: state.devices_firebase[ownProps.deviceID],
})

class DeviceListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      view: false
    }
  }

  displayDeviceControls() {

    var inputs = {
      nested: {
        style: { 
          paddingLeft: this.props.theme.spacing.unit * 12,
        }
      }
      
    }

    return (
      <Collapse in={this.state.view} timeout="auto" unmountOnExit>
        <div>
          {this.props.device.controls.map((thisControl) => {

            return(
             <List disablePadding key={this.props.deviceID + thisControl.controlName}>
               <ListItem  {...inputs.nested}>
                 <ListItemIcon>
                   {thisControl.controlDirection == 0 ? 
                      <Tooltip id='tooltip-input' title='Input' placement="left"> 
                        <Redo /> 
                      </Tooltip>: 
                      <Tooltip id='tooltip-output' title='Output' placement="left"> 
                        <Undo/>
                      </Tooltip>}
                 </ListItemIcon>
                 <ListItemIcon>
                   {thisControl.controlType == 1 ?  
                    <Tooltip id='tooltip-range' title='Range' placement="left"> 
                        <LinearScale/> 
                    </Tooltip> : 
                    <Tooltip id='tooltip-onoff' title='On/Off' placement="left"> 
                        <PowerSettingsNew /> 
                    </Tooltip> }
                 </ListItemIcon>
                 <ListItemText inset secondary={thisControl.controlName} />
               </ListItem>
             </List>
             )
          })}
        </div>
      </Collapse>
    )
  }

  render() {

    var iconName = this.props.device.identity.iconName;
    var name = (iconName == 'light_on' ? 'lightbulb' : iconName);

    var inputs = {
      item: {
        button: true,
        onClick: () => this.setState({view: !this.state.view}),
        onMouseEnter: () => this.setState({hover: true}),
        onMouseLeave: () => this.setState({hover: false})
      },
      primary: {
        style: {
          maxHeight: '100%',
          maxWidth: '100%'
        },
        type:"image/svg+xml",
        data: "src/assets/svg/" + name + ".svg"
      }
    }

    
    return (
      <div>
        <ListItem {...inputs.item}>
          <ListItemIcon>
              <object {...inputs.primary}/>
          </ListItemIcon>
          <ListItemText inset  primary={this.props.device.identity.name} />
          {this.state.view ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        {this.displayDeviceControls()}
        <Divider inset/>

      </div>
    )

  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(DeviceListItem)))

