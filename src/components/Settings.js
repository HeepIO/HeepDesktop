import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../redux/actions_classic'
import { NavLink, withRouter } from 'react-router-dom';

import { Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText } from 'material-ui'

var mapStateToProps = (state) => ({
  preferences: state.preferences
})

class Settings extends React.Component {

  title() {
    return (
      <Typography variant="title" align='center' color="inherit">
          Settings
      </Typography>
    )
  }

  networkingSettings() {

    return (
      <Paper style={{width: '100%', padding: 24}}>
        <FormControl style={{width: '100%'}}>
          <InputLabel htmlFor="search-mode">Addressing Method</InputLabel>
          <Select
            value={this.props.preferences.searchMode}
            onChange={(event) => this.props.setSearchMode(event.target.value)}
          >
            <MenuItem value={'broadcast'}>Broadcast</MenuItem>
            <MenuItem value={'unicast'}>Unicast</MenuItem>
          </Select>
          <FormHelperText>The method used to discover Heep Devices on your local network</FormHelperText>
        </FormControl>
      </Paper>
    )
  }

  render () {

    var inputs = {
      spacer: {
        style: {
          height: 20
        }
      }
    }

    return (
      <div style={{
        margin: 0,
        padding:0,
        maxWidth: '100%',
        height: window.innerHeight - 64, 
        overflow: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#e7e7e7'
      }}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          spacing={24}
          style={{marginTop: 24}}
        >
          <Grid item xs={12}>
            {this.title()}
          </Grid>

          <Grid item xs={8} >
            {this.networkingSettings()}
          </Grid>
        </Grid>
     </div>
    );
  }
}


var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))
