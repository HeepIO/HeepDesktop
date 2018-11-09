import React from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../redux/actions_designer'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {iconMappings} from '../../assets/svg/iconMappings'

import { Paper, Tooltip }  from 'material-ui'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';


var mapStateToProps = (state) => ({
	selectingIcon: state.designer.selectingIcon,
  	icon: state.designer.iconSelected
})

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class IconSVGSelect extends React.Component {
  state = {
    anchorEl: null,
    selectedIndex: 1,
  };

  button = undefined;

  handleClickListItem = event => {
    this.setState({ anchorEl: this.refs.popup });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    const dataUrlPrefix = "src/assets/svg/";

    const inputs = {
    	svgIcon: {
    	      style: {
    	        maxHeight: '100%',
    	        maxWidth: '100%',
    	        position: 'relative'
    	      },
    	      height: '100%',
    	      type:"image/svg+xml",
    	      data: dataUrlPrefix + iconMappings[this.props.icon] + ".svg"
    	},
    	paper: {
	        style: {
	          height: 170,
	          width: 170,
	          padding: 10,
	          marginTop: 24,
	          position: 'relative'
	        },
      	},
      	overlay: {
      		style: {
      			width: '100%',
      			height:'100%',
      			backgroundColor: 'transparent',
      			cursor: 'pointer',
      			position: 'absolute',
      			top: 0,
      			left: 0
      		},
      	},
      	popupHere: {
      		style: {
      			position: 'absolute',
      			right: 0
      		}
      	}
    }


    return (
      <div className={classes.root}>
        <Tooltip id="tooltip-bottom" title="Change Device Icon" placement="bottom">
          <Paper {...inputs.paper}>
                <object {...inputs.svgIcon}/>
                <div {...inputs.overlay}
  		          onClick={this.handleClickListItem}
  		       />
  		       <div {...inputs.popupHere}
  		       		ref='popup'
  	              aria-haspopup="true"
  		          aria-controls="lock-menu"/>
          </Paper>
        </Tooltip>

        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {iconMappings.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === this.props.icon}
              onClick={() => this.props.selectIcon(index)}
            >
            	<ListItemIcon >
		            <object {...inputs.svgIcon} data={dataUrlPrefix + iconMappings[index] + ".svg"}/>
		          </ListItemIcon>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

IconSVGSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(IconSVGSelect)))
