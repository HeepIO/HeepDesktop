import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_designer'
import { withRouter } from 'react-router-dom'

import { withStyles } from 'material-ui/styles';
import { Grid, Select, Collapse, Paper, List, Button }  from 'material-ui'
import { Edit }  from 'material-ui-icons'

import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { sys_phy_files } from '../../HeepDesigner/SystemPHYCompatibilities'
import GenericSelect from '../utilities/GenericSelect'
import PlaceListItem from '../heep/PlaceListItem'
import GenericTextInput from '../utilities/GenericTextInput'
import IconSVGSelect from './IconSVGSelect'
import {iconMappings} from '../../assets/svg/iconMappings'
import AddPlaceModal from '../account/AddPlaceModal'
import {applications} from "../../assets/inoFiles"

var mapStateToProps = (state, ownProps) => ({
  deviceName: state.designer.deviceName,
  systemType: state.designer.systemType,
  physicalLayer: state.designer.physicalLayer,
  controls: state.designer.controls,
  places: state.places,
  selectedPlace: state.designer.selectedPlace,
  ssid: state.designer.ssid,
  ssidPassword: state.designer.ssidPassword,
  applicationName: state.designer.applicationName
})

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 120
  },
  formControlSimple: {
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class DeviceIdentity extends React.Component {
  state = {
    open: false
  }

  nameDevice = () => (

    <GenericTextInput 
      title='Enter Device Name'
      value={this.props.deviceName}
      onChange={(value) => {this.props.updateDeviceName(value)}}
    />

  )

  selectSystemType = () => (

    <FormControl className={this.props.classes.formControl} style={{width:'100%'}}>
      <InputLabel htmlFor="type-helper">System Type</InputLabel>
      <Select
        value={this.props.systemType}
        title='Select System Type'
        onChange={ (event) => {this.props.updateSystemType(event.target.value)}}
        input={<Input name="type-helper" id="type-helper" />}
      >
        {Object.keys(sys_phy_files).map((thisKey) => (
          <MenuItem value={thisKey} key={thisKey}>{thisKey}</MenuItem>
        ))}
      </Select>
    </FormControl>

  )

  inputWifiCredentials = () => (

      <Collapse in={this.props.physicalLayer == 'wifi'} timeout={750} unmountOnExit>
        <FormControl className={this.props.classes.formControl} style={{width:'100%'}}>
          <InputLabel htmlFor="wifi-helper" >Select WiFi Credentials</InputLabel>
          <Select
            value={this.props.selectedPlace}
            style={{width:'100%', marginBottom: 24}}
            title='Select WiFi Credentials'
            onChange={ (event) => {this.props.selectPlace(event.target.value)}}
            input={<Input name="place-helper" id="place-helper" />}
          >
            {Object.keys(this.props.places).concat('Enter New WiFi').map((thisKey) => (
              <MenuItem value={thisKey} key={thisKey}>{this.props.places[thisKey] ? this.props.places[thisKey].name : 'Enter New WiFi'}</MenuItem>
            ))}
          </Select>

          <Grid container justify='space-between'> 
            <Grid item xs={6}>
              <GenericTextInput 
                title='SSID'
                width='100%'
                disabled={this.props.selectedPlace != 'Enter New WiFi'}
                value={this.props.ssid}
                onChange={(value) => {this.props.updateSSID(value)}}
              />
            </Grid>
            <Grid item xs={6}>
              <GenericTextInput 
                value={this.props.ssidPassword}
                width='100%'
                disabled={this.props.selectedPlace != 'Enter New WiFi'}
                title='Password'
                onChange={(value) => {this.props.updateSSIDPassword(value)}}
              />
            </Grid>
            {this.props.selectedPlace == 'Enter New WiFi' && (
                <Grid item xs={12}>
                  <AddPlaceModal 
                    open={this.state.open} 
                    ssid={this.props.ssid} 
                    password={this.props.ssidPassword} 
                    handleClose={()=> this.setState({open: false})} 
                    modalElement={
                      <Button style={{float:'right'}} onClick={() => this.setState({open: true})}>
                        Save for Later
                      </Button>
                    }/>
                </Grid>
            )}
            
          </Grid>

        </FormControl>

      </Collapse>
  )

  selectApplication = () => (

    <FormControl className={this.props.classes.formControl} style={{width:'100%'}}>
      <InputLabel htmlFor="type-helper">Application Type</InputLabel>
      <Select
        value={this.props.applicationName}
        title='Select Application Type'
        onChange={ (event) => {this.props.updateApplicationName(event.target.value)}}
        input={<Input name="type-helper" id="type-helper" />}
      >
        {Object.keys(applications).map((thisKey) => (
          <MenuItem value={thisKey} key={thisKey}>{thisKey}</MenuItem>
        ))}
      </Select>
    </FormControl>

  )

  render () {

    return (
      <Grid container justify='center' spacing={24}>
        <Grid item xs={4}>
          <Grid container justify='center' spacing={24} style={{}}>
          <Grid item>
            <IconSVGSelect/>
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container direction='column' spacing={24}>
            <Grid item >
              {this.nameDevice()}
            </Grid>
            <Grid item>
              {this.selectSystemType()}
            </Grid>
            <Grid item>
              {this.inputWifiCredentials()}
            </Grid>
            <Grid item>
              {this.selectApplication()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)(DeviceIdentity)))
