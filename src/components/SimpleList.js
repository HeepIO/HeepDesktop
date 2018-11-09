import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, NavLink } from 'react-router-dom'
import * as Actions from './../redux/actions_classic'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import { Refresh, Build, TrackChanges, Home, ShowChart, DeleteSweep, ChildCare, Settings } from 'material-ui-icons';

import { Divider, Tooltip } from 'material-ui'

var mapStateToProps = (state) => ({
  liveMode: state.flowchart.liveModeReference
})

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class NestedList extends React.Component {
  state = { open: true };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  componentWillMount() {
    if (this.props.liveMode) {
      this.props.startLiveMode()
    }
  }

  deviceBuilder = () => (
    <NavLink to="/designer" style={{
      textDecoration: 'none',
      outline: 'none',
      width: '100%',
      height: '100%'
    }}>   
      <ListItem button>
        <ListItemIcon>
          <Build />
        </ListItemIcon>
        <ListItemText inset primary="Design" />
      </ListItem>
    </NavLink>
  )

  flowchartNav = () => (
    <NavLink to="/" style={{
      textDecoration: 'none',
      outline: 'none'
    }}>
      <ListItem button>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText inset primary="Home" />
      </ListItem>
    </NavLink>
  )

  analyticsNav = () => (
    <NavLink to="/Analytics" style={{
      textDecoration: 'none',
      outline: 'none'
    }}>
      <ListItem button>
        <ListItemIcon>
          <ShowChart />
        </ListItemIcon>
        <ListItemText inset primary="Analytics" />
      </ListItem>
    </NavLink>
  )

  liveModeToggle = () => (
    <ListItem button onClick={ () => this.props.liveMode == null ? this.props.startLiveMode() : this.props.stopLiveMode()}>
      <ListItemIcon>
        <TrackChanges color={this.props.liveMode == null ? 'disabled' : 'secondary'}/>
      </ListItemIcon>
      <ListItemText inset primary="Live Mode" />
    </ListItem>
  )

  refreshFlowchart = () => (
    <ListItem button onClick={ () => this.props.refreshFlowchart()}>
      <ListItemIcon>
        <Refresh />
      </ListItemIcon>
      <ListItemText inset primary="Soft Refresh" />
    </ListItem>
  )

  hardRefresh = () => (
    <ListItem button onClick={ () => this.props.hardRefresh()}>
      <ListItemIcon>
        <DeleteSweep />
      </ListItemIcon>
      <ListItemText inset primary="Hard Refresh" />
    </ListItem>
  )

  settings = () => (
    <NavLink to="/Settings" style={{
      textDecoration: 'none',
      outline: 'none'
    }}>
      <ListItem button>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText inset primary="Settings" />
      </ListItem>
    </NavLink>
  )

  accessibilityMode = () => (

    <NavLink to="/AccessPoints" style={{
      textDecoration: 'none',
      outline: 'none'
    }}>
      <ListItem button onClick={ () => this.props.searchForAccessPoints()}>
        <ListItemIcon>
          <ChildCare />
        </ListItemIcon>
        <ListItemText inset primary="New Device" />
      </ListItem>
    </NavLink>
  )

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List
          component="nav"
        >
          {this.flowchartNav()}
          {this.deviceBuilder()}
          {this.analyticsNav()}
          {this.accessibilityMode()}
          {this.settings()}
          <Divider/>
          {this.liveModeToggle()}
          {this.refreshFlowchart()}
          {this.hardRefresh()}


        </List>
      </div>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NestedList)))
