import React from 'react';

import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import * as actions           from '../../redux/actions_classic'

import { withTheme } from 'material-ui/styles'
import { Divider, Typography, Collapse, Tooltip, Button, Menu, TextField } from 'material-ui'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import { Redo, Undo, LinearScale, PowerSettingsNew, ExpandLess, ExpandMore, Delete } from 'material-ui-icons'

var mapStateToProps = (state, ownProps) => ({
  thisVertex: state.vertexList[ownProps.vertexID],
  rxDevice: state.devices[state.vertexList[ownProps.vertexID].rxDeviceID],
  txDevice: state.devices[state.vertexList[ownProps.vertexID].txDeviceID],
  txControlName: state.controls[state.vertexList[ownProps.vertexID].txDeviceID + '.' + state.vertexList[ownProps.vertexID].txControlID].controlName,
  rxControlName: state.controls[state.vertexList[ownProps.vertexID].rxDeviceID + '.' + state.vertexList[ownProps.vertexID].rxControlID] != undefined ? 
              state.controls[state.vertexList[ownProps.vertexID].rxDeviceID + '.' + state.vertexList[ownProps.vertexID].rxControlID].controlName :
              state.vertexList[ownProps.vertexID].rxDeviceID + '.' + state.vertexList[ownProps.vertexID].rxControlID
})

class DetailsPanelVertexBlock extends React.Component {
  state = {
    view: false,
    anchorEl: null
  }

  render() {

    const buttonSize = 30;

    const inputs = {
      buttons: {
        style: {
          padding: 0,
          height: buttonSize,
          width: buttonSize,
          minWidth: buttonSize
        }
      },
      activeIcons: {
        style: {
          color: this.props.valueCurrent == 1 ? '#03a9f4' : '#7e838a'
        }
      },
      inactiveIcons: {
        style: {
          color: '#7e838a'
        }
      },
    }

    return (  
        <List 
            disablePadding 
            dense
          >
            <ListItem 
              button 
              onClick={() => this.setState({view: !this.state.view})}
              style={{paddingLeft: 4}}>
              <ListItemIcon >
                <Button {...inputs.buttons}
                  onClick={(event) => {
                    event.stopPropagation();
                    this.props.deleteVertex(this.props.vertexID)
                  }}
                >
                  <Delete {...inputs.inactiveIcons}/>
                </Button>
              </ListItemIcon>
              <ListItemText primary={this.props.txControlName + ' -> ' + this.props.rxControlName}/>
              {this.state.view ? <ExpandLess /> : <ExpandMore />}

            </ListItem>


            
            <Collapse in={this.state.view} timeout="auto" unmountOnExit>
              <div>

                {Object.keys(this.props.thisVertex).map((field) => (
                  this.listField(field, this.props.thisVertex[field])
                ))}

              </div>
            </Collapse>
            <Divider/>
          </List>
        
    );
  }


  listField(field, value) {

    return (
      <ListItem key={field} 
      > 
        <ListItemText primary={field + ' : '} />
        <Typography >
          {value.toString()}
        </Typography>
      </ListItem>
    )
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(DetailsPanelVertexBlock)))