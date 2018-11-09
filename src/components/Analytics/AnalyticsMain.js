import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink, withRouter } from 'react-router-dom'
import * as Actions from '../../redux/actions'

import { Grid } from 'material-ui'
import { withTheme } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List';

import AnalyticsList from './AnalyticsList'
import DailyActivityGraph from './DailyActivityGraph'
import BusyTimesGraph from './BusyTimesGraph'

const mapStateToProps = (state, ownProps) => ({
  deviceID: ownProps.match.params.deviceID,
  devicesWithAnalytics: Object.keys(state.analytics),
  deviceNames: Array.from(Object.keys(state.analytics), deviceID => state.devices[deviceID].name),
  deviceImages: Array.from(Object.keys(state.analytics), deviceID => state.devices[deviceID].iconName)
})

class AnalyticsMain extends React.Component {

  availableDevices() {

    return (
      <List component="nav"

        subheader={
          <ListSubheader component="div" style={{
            padding: 0, 
            paddingLeft: this.props.theme.spacing.unit,
            backgroundColor: 'white'
          }}>
            Heep Analytics
          </ListSubheader>
      }>
          
        {this.props.devicesWithAnalytics.map((deviceID, index) => (
          this.deviceAnalyticsLink(deviceID, index)
        ))}
      </List>
    )
  }

  deviceAnalyticsLink(deviceID, index) {

    const highlight = this.props.deviceID ? this.props.deviceID : this.props.devicesWithAnalytics[0] ;

    return (
      <NavLink 
        to={"/Analytics/" + deviceID}
        key={'analytics' + deviceID} 
        style={{
          textDecoration: 'none',
          outline: 'none'
        }}>
        <ListItem button style={{padding: this.props.theme.spacing.unit * 1.5}}>
          <ListItemIcon >
            <img 
              src={"src/assets/svg/" + this.props.deviceImages[index] + ".svg"} 
              style={{maxHeight: '200%', maxWidth: '200%'}}/>
          </ListItemIcon>
          <ListItemText 
            primary={this.props.deviceNames[index]} 
            style={{
              padding: 0
            }}/>
        </ListItem>
      </NavLink>
    )
  }

  render () {

    var inputs = {
      displayAnalytics: {
        deviceID: this.props.deviceID ? this.props.deviceID : this.props.devicesWithAnalytics[0] 
      }
    }

    return (
      <Grid container alignItems='stretch' style={{margin: 0}}>
        <Grid item xs={2} style={{boxShadow: '1px 1px 1px lightgrey', padding: 0}}>
          {this.availableDevices()}
        </Grid>
        <Grid item xs>
          {inputs.displayAnalytics.deviceID && (
            <div>
              <AnalyticsList {...inputs.displayAnalytics}/> 
              <DailyActivityGraph {...inputs.displayAnalytics}/> 
              <BusyTimesGraph {...inputs.displayAnalytics}/>
            </div>
          )}
          
        </Grid>
     </Grid>
    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(AnalyticsMain)))
