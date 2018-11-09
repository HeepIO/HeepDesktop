import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink, withRouter } from 'react-router-dom'
import * as Actions from '../redux/actions_classic'

import { Grid, Typography, Divider,  } from 'material-ui'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import { NetworkWifi, CheckCircle, Cancel } from 'material-ui-icons'

import { withTheme } from 'material-ui/styles';
import VerticalStepper from './utilities/VerticalStepper'
import DeviceDetailsPanel from './heep/DeviceDetailsPanel'

const mapStateToProps = (state, ownProps) => ({
  accessPoints: state.accessPoints,
  accessPointStatus: state.accessPointData,
  places: state.places,
  allWifis: state.deviceWiFiCreds,
  deviceWifis: state.deviceWiFiCreds[state.accessPointData.deviceID]
})

class SearchAccessPointsForm extends React.Component {


  componentWillMount() {
    this.props.setDetailsPanelDeviceID(null);
    this.startAPSearch();
  }

  componentWillUnmount() {
    this.stopAPSearch();
  }

  startAPSearch() {
    this.searchRef = setInterval(() => this.props.searchForAccessPoints(), 5000);
  }

  stopAPSearch() {
    clearTimeout(this.searchRef);
  }

  createAPForm() {

    const inputs = {
      stepper: {
        steps: [
          {
            title: 'Select a Device to Connect to',
            description: `Chose from below `,
            form: this.selectAccessPoint()
          },
          {
            title: 'Push WiFi Credentials to this Device?',
            description: `Would you like to let this device know how to log on to your local network?`,
            form: this.listPlaceOptions()
          },
          {
            title: 'Complete Setup',
            description: `Now that your device knows how to log onto the wifi, complete the setup by resetting the device!`
          }
        ],
        completionCallback: () => {
          this.props.resetDeviceAndOSWifi(this.props.accessPointStatus.deviceID);
        }
      }
    }

    return (
      <div style={{
        paddingTop: 20
      }}>
        <Typography variant="title" align='center' color="inherit">
            Connect to a Heep Device
        </Typography>
        <VerticalStepper {...inputs.stepper}/>
      </div>
    )

  }

  selectAccessPoint() {

    return (
      <List
        disablePadding
        dense
        subheader={
          <ListSubheader component="div" style={{padding: 0, backgroundColor: 'white'}}>
            Heep Access Points
          </ListSubheader>}>

        <Divider/>

        {Object.keys(this.props.accessPoints).sort().map((accessPointSSID) => (
          <ListItem
            button
            onClick={() => { this.stopAPSearch(); this.props.connectToAccessPoint(accessPointSSID);}}
            style={{paddingRight: 0}}
            key={accessPointSSID}>
            <ListItemIcon>
                <NetworkWifi/>
            </ListItemIcon>
            <ListItemText primary={accessPointSSID} />
            {this.props.accessPointStatus.currentlyConnecting == accessPointSSID ? <CircularProgress /> : null}
            {this.props.accessPointStatus.connectedTo == accessPointSSID ? <CheckCircle nativeColor='green'/> : null}
            {this.props.accessPointStatus.failedAttempt == accessPointSSID ? <Cancel nativeColor='red'/> : null}
          </ListItem>

        ))}

      </List>
    )
  }

  listPlaceOptions() {

    return (
      <List
        disablePadding
        dense
        subheader={
          <ListSubheader component="div" style={{padding: 0, backgroundColor: 'white'}}>
            Your Places
          </ListSubheader>}>

        <Divider/>

        {Object.keys(this.props.places).map((thisPlaceKey) => (
          <ListItem
            button
            onClick={() => {
              console.log('selected: ', this.props.places[thisPlaceKey].name);
              this.props.sendWiFiCredentialsToDevice(this.props.accessPointStatus.deviceID, thisPlaceKey)
            }}
            style={{paddingRight: 0}}
            key={thisPlaceKey}>
            <ListItemIcon>
                <NetworkWifi/>
            </ListItemIcon>
            <ListItemText primary={this.props.places[thisPlaceKey].name} />
          </ListItem>

        ))}
      </List>
    )
  }

  render () {

    return (
      <div style={{
        height: window.innerHeight - 64
      }}>
        <Grid container justify='center' style={{margin: 0, maxWidth: '100%'}}>
          <Grid item xs={7} >
            {this.createAPForm()}
          </Grid>
          <DeviceDetailsPanel/>
       </Grid>
     </div>

    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(SearchAccessPointsForm)))
