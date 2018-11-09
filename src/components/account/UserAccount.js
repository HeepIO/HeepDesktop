import React                  from 'react';
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import * as actions           from '../../redux/actions'

import { withTheme }       from 'material-ui/styles'
import { Grid, Tooltip, Typography, Avatar, Divider, IconButton, List, ListItem, ListItemText, ListItemIcon}  from 'material-ui'
import { Edit, Add }  from 'material-ui-icons'

import DeviceListItem from '../heep/DeviceListItem'
import PlaceListItem from '../heep/PlaceListItem'
import AddPlaceModal from './AddPlaceModal'

var mapStateToProps = (state) => ({
  loginStatus: state.loginStatus,
  user: state.user,
  userName: state.user ? state.user.displayName: '',
  userImage: state.user ? state.user.photoURL : null,
  devices: state.devices_firebase,
  places: state.places
})

class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  userProfileImage() {
    var inputs = {
      avatar: {
        alt: this.props.user.displayName,
        src: this.props.user.photoURL,
        style: {
          width: '100%',
          height: 'auto',
          minHeight: 150
        }
      }
    }

    return (
      <Avatar {...inputs.avatar}>
        {this.props.userImage ? null : this.props.userName.split(' ').map((word) => word[0])}
      </Avatar>
    )
  }

  userDetails() {

    return (
      <div>
        {this.titleEditDivider(this.props.user.displayName, () => console.log('edit username or email'))}

        <Typography variant="body1" style={{marginTop: this.props.theme.spacing.unit}}>
          {this.props.user.email}
        </Typography>
      </div>
    )
  }

  titleEditDivider(title, onClick, edit = true) {

    return (
      <div>
        <Grid container alignItems='center' >
          <Grid item xs>
            <Typography variant="title" gutterBottom={!edit}>
              {title}
            </Typography>
          </Grid>

          <Grid item xs>
            {edit ? 
              
                <IconButton 
                  style={{float:'right'}}
                  onClick={onClick}
                >
                  <Tooltip id="tooltip-edit" title="Edit">
                    <Edit />
                  </Tooltip>
                </IconButton> 

              : <div/>
            }
          </Grid>
        </Grid>

        <Divider/>
      </div>
    )
  }

  userPlaces() {

    return(
      <div>
        {this.titleEditDivider('My Places', () => console.log('Edit Places'), false)}
        <List>
          {Object.keys(this.props.places).map((placeID) => (
            <PlaceListItem placeID={placeID} key={placeID}/>
          ))}
          <AddPlaceModal open={this.state.open} handleClose={()=> this.setState({open: false})} modalElement={
            <ListItem button color='secondary' onClick={()=> this.setState({open: true})}>
              <ListItemIcon>
                <Add/>
              </ListItemIcon>
              <ListItemText inset secondary='Add a New Place' />
            </ListItem>
          }/>
        </List>
      </div>
    )
  }

  userDevices() {
    return(
      <div>
        {this.titleEditDivider('My Devices', () => console.log('Edit Device Details Remotely'), false)}
        <List >
          {Object.keys(this.props.devices).map((deviceID) => {
            
            if (deviceID != 'deviceArray'){
              return <DeviceListItem deviceID={deviceID} key={deviceID}/>
            }
            
          })}
        </List>
      </div>
    )
  }

  render() {

    return (
      <Grid container justify='center' style={{paddingTop: 50, maxWidth:'100%'}}>
        <Grid item xs={10}>
          <Grid container spacing={24} alignItems='center'>
            <Grid item xs={3}>
              {this.userProfileImage()}
            </Grid>
            <Grid item xs={9}>
              {this.userDetails()}
            </Grid>
            <Grid item xs={12}>
              {this.userPlaces()}
            </Grid>

            <Grid item xs={12}>
              {this.userDevices()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(UserAccount)))
