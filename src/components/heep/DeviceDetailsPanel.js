import React from 'react';

import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import * as actions           from '../../redux/actions_classic'

import { withStyles, withTheme } from 'material-ui/styles';
import { Grid, Drawer, Button, Divider, Paper, Typography, IconButton, Menu, MenuItem, Collapse } from 'material-ui';
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List';

import Close from 'material-ui-icons/Close'
import Add from 'material-ui-icons/Add'
import NetworkWifi from 'material-ui-icons/NetworkWifi'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import AutoRenew from 'material-ui-icons/AutoRenew'

import DetailsPanelControlBlock from './DetailsPanelControlBlock'
import DetailsPanelVertex from './DetailsPanelVertex'
import PlaceListItem from './PlaceListItem'
import AddPlaceModal from '../account/AddPlaceModal'

import classNames from 'classnames';

var mapStateToProps = (state) => ({
  deviceID:  state.detailsPanelDeviceID,
  device: state.devices[state.detailsPanelDeviceID],
  controls: state.devices[state.detailsPanelDeviceID] ? state.devices[state.detailsPanelDeviceID].inputs.concat(state.devices[state.detailsPanelDeviceID].outputs): [],//Object.keys(state.controls).filter((thisControl) => state.controls[thisControl] ? state.controls[thisControl].deviceID == state.detailsPanelDeviceID : false),
  places: state.places,
  deviceWiFiCreds: state.deviceWiFiCreds[state.detailsPanelDeviceID],
  allVertices: state.vertexList
})

const drawerWidth = 300;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    overflowX: 'hidden',
    elevation: 4,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#fafafa'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: 0
  }
});

class DeviceDetailsPanel extends React.Component {
  state = {
      open: false,
      anchorEl: null,
      viewNetworks: false,
      addPlaceModalopen: false
    }

  render() {

    const { classes, theme } = this.props;

    return (  
      <div style={{
          position: 'fixed', 
          right:0,
          top: 0
         }} 
         id='detailsPanel'
      >
        <Drawer 
          variant='permanent' 
          open={this.props.deviceID != null} 
          classes={{
            paper: classNames(classes.drawerPaper, this.props.deviceID == null && classes.drawerPaperClose),
          }}
        >
          {this.props.deviceID != null && (this.deviceDetails())}
          
        </Drawer>
      </div>
    );
  }

  deviceDetails() {
    return (
      <div style={{
        width: this.props.deviceID != null ? drawerWidth : 0, 
        marginTop: 70,
        padding: this.props.theme.spacing.unit,
        position: 'relative',
        overflowY: 'auto'
      }}>


        {this.detailsTitle()}

        <IconButton 
          onClick={() => this.props.setDetailsPanelDeviceID(null)}
          size='small'
          style={{
            position: 'absolute', 
            right: 24, 
            height: 24,
            width: 24,
            top: 4, 
            fontSize: 16,
            cursor: 'pointer'
          }}>
            <Close 
              style={{
                fontSize: 16
              }}/>
          </IconButton>

        <List 
          disablePadding 
          dense
          subheader={<ListSubheader component="div" style={{padding: 0, backgroundColor: '#fafafa'}}>Device Details</ListSubheader>}>
          
          <Divider/>

          {Object.keys(this.props.device).map((field) => {
            if (field != 'inputs' && field != 'outputs') {
              return this.deviceIdentity(field, this.props.device[field])
            }
          })}
        </List>

        {this.deviceOptions()}

        {this.listControls()}

        {this.listVertices()}
        
      </div>
    )
  }

  listControls() {
    return (
      <List 
        disablePadding 
        dense
        subheader={
          <ListSubheader component="div" style={{padding: 0, backgroundColor: '#fafafa'}}>
            Controls
          </ListSubheader>}>
        
        <Divider/>

        {this.props.controls.map((controlID) => (
          <DetailsPanelControlBlock key={controlID} controlID={controlID}/>
        ))}

      </List>
    )
  }

  listVertices = () => (
    <List 
      disablePadding 
      dense
      subheader={
        <ListSubheader component="div" style={{padding: 0, backgroundColor: '#fafafa'}}>
          Vertices
        </ListSubheader>}>
      
      <Divider/>

      {Object.keys(this.props.allVertices).map((thisVertexID) => {
        if (this.props.allVertices[thisVertexID].txDeviceID == this.props.deviceID) {
          return <DetailsPanelVertex key={thisVertexID} vertexID={thisVertexID}/>
        }
      })}

    </List>
  )

  detailsTitle() {

    var inputs = {
      primary: {
        style: {
          maxHeight: '100%',
          maxWidth: '100%'
        },
        type:"image/svg+xml",
        data: "src/assets/svg/" + this.props.device.iconName + ".svg"
      }
    }

    return (
      <Grid 
        container 
        alignItems='center' 
        justify='center' 
        spacing={16}
        style={{
          marginTop: 24
        }}
      >

        <Grid item xs={12}>
          <Grid 
            container 
            alignItems='center' 
            justify='center' 
            style={{
              width: '100%'
            }}
          >
            <Grid item>
              <Typography variant='title'>
                {this.props.device.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <object {...inputs.primary}/>
        </Grid>
        
      </Grid>
    )
  }

  deviceIdentity(field, value) {

    return (
      <ListItem key={field} > 
        <ListItemText primary={field + ' : '} />
        <Typography >
          {value.toString()}
        </Typography>
      </ListItem>
    )
  }

  deviceOptions() {

    return (
      <List disablePadding dense
        subheader={
          <ListSubheader component="div" style={{padding: 0, backgroundColor: '#fafafa'}}>
            Options
          </ListSubheader>}>
        
        <Divider/>

        <ListItem button onClick={()=> this.setState({viewNetworks: !this.state.viewNetworks})}>
          <ListItemText primary={'Networking'} />
          {this.state.viewNetworks ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={this.state.viewNetworks} timeout="auto" unmountOnExit>
          <div>
            {this.props.deviceWiFiCreds && Object.keys(this.props.deviceWiFiCreds).map((cred) => (
              <ListItem key={cred} > 
                <NetworkWifi />
                <ListItemText primary={cred} />
              </ListItem>
            ))}
          </div>

          <ListItem button onClick={(event) => this.setState({ anchorEl: event.currentTarget })}> 
            <ListItemIcon>
              <Add/>
            </ListItemIcon>
            <ListItemText primary={'Attach Place'} />

            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={() => this.setState({ anchorEl: null })}
            >
              {Object.keys(this.props.places).map((placeKey) => (
                <MenuItem key={placeKey} onClick={() => this.props.sendWiFiCredentialsToDevice(this.props.deviceID, placeKey)}>
                  
                  <ListItemText primary={this.props.places[placeKey].name} secondary={this.props.places[placeKey].networks.wifi.ssid} />
                </MenuItem>
              ))}

              <AddPlaceModal open={this.state.addPlaceModalopen} handleClose={()=> this.setState({addPlaceModalopen: false})} modalElement={
                <ListItem button color='secondary' onClick={()=> this.setState({addPlaceModalopen: true})}>
                  <ListItemIcon>
                    <Add/>
                  </ListItemIcon>
                  <ListItemText inset secondary='Create New Place' />
                </ListItem>
              }/>

            </Menu>

          </ListItem>

          <ListItem button color='secondary' onClick={() => this.props.resetDeviceWifi(this.props.deviceID)}>
            <ListItemIcon>
              <AutoRenew/>
            </ListItemIcon>
            <ListItemText inset primary='Reset Device Wifi' />
          </ListItem>

        </Collapse>
        
      </List>
    )
  }

  
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DeviceDetailsPanel)))
