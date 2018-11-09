import React from 'react';
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import { NavLink }      from 'react-router-dom'


import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import AccountCircle from 'material-ui-icons/AccountCircle';
import {  Avatar }from 'material-ui';
import Menu, { MenuItem }               from 'material-ui/Menu';


import SimpleList from './SimpleList'
import * as actions from '../redux/actions'
import * as actions_classic from '../redux/actions_classic'

var mapStateToProps = (state) => ({
  loginStatus: state.loginStatus,
  userName: state.user ? state.user.displayName: '',
  userImage: state.user ? state.user.photoURL : null
})

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  flex: {
    flex: 1,
  },
  navLink: {
    textDecoration: 'none',
    outline: 'none'
  }
});

class AppBarDrawer extends React.Component {
  state = {
    open: false,
    auth: true,
    anchorEl: null,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.props.logoutOfFirebase();
    this.handleClose();
  }

  loggedOn() {
    return (
      <div style={{marginLeft: 15}}>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Avatar
            alt={this.props.userName}
            src={this.props.userImage}
            className={classNames(this.props.avatar, this.props.bigAvatar)}
          >
            {this.props.userImage ? null : this.props.userName.split(' ').map((word) => word[0])}
          </Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <NavLink to="/User" style={styles(this.props.theme).navLink}>
            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
          </NavLink>
          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }

  notLoggedOn() {

    return (
      <div>
        <IconButton
          aria-owns={Boolean(this.state.anchorEl) ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <NavLink to="/auth" style={styles(this.props.theme).navLink}>
            <MenuItem onClick={this.handleClose}>Login</MenuItem>
          </NavLink>

          <NavLink to="/auth" style={styles(this.props.theme).navLink}>
            <MenuItem onClick={this.handleClose}>Create Account</MenuItem>
          </NavLink>
        </Menu>
      </div>
    );
  }

  renderAppBar() {
    const { classes, theme } = this.props;

    var inputs = {
      Logo: {
        src: 'src/assets/svg/SideBySide.svg',
        height: 50,
        style: {
          maxWidth: "250%",
          marginLeft: this.state.open ? this.props.theme.spacing.unit * 4 : 'inherit'
        }
      },
    }

    return (
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
      >
        <Toolbar disableGutters={!this.state.open}>


          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            className={classNames(classes.menuButton, this.state.open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <NavLink to="/">
            <Button>
                <img {...inputs.Logo}/>
            </Button>
          </NavLink>

          <div className={classes.flex}/>

          {this.props.loginStatus ? this.loggedOn() : this.notLoggedOn()}


        </Toolbar>
      </AppBar>

    )
  }

  renderDrawer() {
    const { classes, theme } = this.props;

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
        }}
        open={this.state.open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <SimpleList />
        <Divider />
      </Drawer>
    )
  }

  render() {
    const { classes, theme } = this.props;



    return (
      <div >
        {this.renderAppBar()}
        {this.renderDrawer()}

      </div>
    );
  }
}

AppBarDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...actions, ...actions_classic}, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppBarDrawer)))
