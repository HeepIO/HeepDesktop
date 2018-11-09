import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions_classic'
import * as newActions from '../../redux/actions'
import Control from './Controls';
import DynamicIcon from './DynamicIcon';
import { Paper, Button, Typography, Grid, IconButton, Collapse } from 'material-ui'
import { withTheme } from 'material-ui/styles'
import InfoOutline from 'material-ui-icons/InfoOutline'
import KeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown'
import { TweenLite } from 'gsap'

var mapStateToProps = (state, ownProps) => ({
  device: state.devices[ownProps.DeviceID],
  deviceID: ownProps.DeviceID,
  collapsed: state.flowchart.devices[ownProps.DeviceID] ? state.flowchart.devices[ownProps.DeviceID].collapsed : false,
  controlInputs: state.devices[ownProps.DeviceID].inputs,
  controlOutputs: state.devices[ownProps.DeviceID].outputs,
  detailsPanelDeviceID: state.detailsPanelDeviceID
})


class Device extends React.Component {
	constructor(props) {
		super(props);

	}


	deviceName = () => (
		<Typography variant='subheading' align='center' style={{userSelect: 'none', fontWeight: 'bold', fontSize: 18}}>
			{this.props.device.name}
		</Typography>
	);

	drawControls(controlList) {
		return (
			<div >
				{controlList.map((controlKey) => {
					return <Control key={controlKey} deviceID={this.props.device.deviceID} controlID={controlKey}/>
				}
				)}
			</div>
		)
	};

	drawDeviceIcon() {
		const svgIcon = {
			style: {
			  maxHeight: '100%',
			  maxWidth: '100%'
			},
			width: '100%',
	        type:"image/svg+xml",
	        data: "src/assets/svg/" + this.props.device.iconName + ".svg"
		}


		return (
			<div style={{position:'relative'}}>
				<object {...svgIcon}  />
				<div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', cursor:'grab'}}/>
			</div>
		)
	};

	drawOptions() {
		const inputs= {
      buttonContainer: {
        style: {
          position: 'absolute',
          top: 11,
          right: 5
        }
      },
      infoButton: {
  			style: {
          padding: 0,
          height: 30,
          width: 30,
          minWidth: 30
        },
  			color: this.props.detailsPanelDeviceID == this.props.device.deviceID ? 'secondary' : 'default',
  			onClick: () => this.props.detailsPanelDeviceID == this.props.device.deviceID ?
  							this.props.setDetailsPanelDeviceID(null) :
  							this.props.setDetailsPanelDeviceID(this.props.device.deviceID)
			},
      infoIcon: {
        style: {
          color: this.props.detailsPanelDeviceID == this.props.device.deviceID ? '#03a9f4' : '#7e838a'
        }
      },
      collapseButton: {
        style: {
          padding: 0,
          height: 30,
          width: 30,
          minWidth: 30
        },
  			color:  this.props.collapsed ? 'secondary' : 'default',
  			onClick: () => this.animateCollapse()
      },
      collapsedIcon: {
        style: {
          color: this.props.collapsed ? '#03a9f4' : '#7e838a'
        }
      }
    }

		return (
      <div {...inputs.buttonContainer}>
  			<Grid container justify='flex-end' spacing={0}>
          <Grid item xs={12}>
            <Button {...inputs.collapseButton}>
    					<KeyboardArrowDown {...inputs.collapsedIcon}/>
    				</Button>
            <Button {...inputs.infoButton}>
    					<InfoOutline {...inputs.infoIcon}/>
    				</Button>
          </Grid>
  			</Grid>
      </div>
		)
	};

  drawTopItems() {
    const inputs = {
      titleContainer: {
        style: {
          margin: "0 auto",
          paddingTop: 0,
          paddingBottom: 0,
          height: 30,
          maxWidth: "100%"
        },
        pointerEvents: 'none',
        overflow: 'visible'
      },
      circleContainer: {
        style: {
          height: 25,
          width: 20,
        }
      },
      rxCircle: {
        id: this.props.deviceID+ '_rx',
        cx: 0,
        cy: 15,
        r: 8,
        fill: 'none',
      },
      txCircle: {
        id: this.props.deviceID+ '_tx',
        cx: 20,
        cy: 15,
        r: 8,
        fill: 'none',
      },
    }

    return (
      <Grid container {...inputs.titleContainer} justify='space-between' alignItems='center'>
        <Grid item xs={2}>
        <svg {...inputs.circleContainer}>
          <circle {...inputs.rxCircle} />
        </svg>
        </Grid>

          <Grid item xs={8}>
            {this.deviceName()}
          </Grid>

          <Grid item xs={2}>
          <svg {...inputs.circleContainer}>
            <circle {...inputs.txCircle} />
          </svg>
          </Grid>
      </Grid>
    )
  };

  drawDetails() {
    const inputs = {
      deviceDetails: {
        style: {
          opacity: this.props.collapsed ? 0 : 0
        }
      }
    }

    return (
      <Grid container direction='row' justify='space-between'>
        <Grid item xs={12} id={this.props.deviceID+'_details'}>
          <Collapse in={!this.props.collapsed} style={{overflow: 'visible'}} timeout="auto" unmountOnExit>
            <Grid container direction='row' justify='space-around' alignItems='stretch' spacing={0}>

              <Grid item xs={4}>
                {this.drawControls(this.props.controlInputs)}
              </Grid>

              <Grid item xs={4}>
                <Grid container alignItems='center' spacing={0} style={{height:'100%', margin: 0, paddingTop: 10}}>
                  <Grid item xs={12}>
                    {this.drawDeviceIcon()}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={4}>
                {this.drawControls(this.props.controlOutputs)}
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    )
  }

  animateCollapse() {
    const deviceDetails = document.getElementById(this.props.deviceID+'_details')
    const deviceVertices = '.vertex' + this.props.deviceID.toString()

    TweenLite.set(deviceVertices, {opacity: 0})

    function updatingVertex() {
      this.props.updateVertex()
    }

    if (this.props.collapsed) {
      TweenLite.to(deviceDetails, 1, {opacity: 1, onComplete: updatingVertex.bind(this)}).delay(0.5)
      this.props.collapseDevice(this.props.deviceID)
      setTimeout(updatingVertex.bind(this), 300)

    } else {
      this.props.collapseDevice(this.props.deviceID)
      TweenLite.to(deviceVertices, 1, {opacity: 1})
      TweenLite.set(deviceDetails, {opacity: 0})
      setTimeout(updatingVertex.bind(this), 300)
    }
  };


	render() {

		const inputs = {
      deviceContainer: {
        style: {
          paddingTop: this.props.theme.spacing.unit,
          paddingBottom: this.props.theme.spacing.unit,
          margin: "0 auto",
          maxWidth: "100%",
          userSelect: "none"
        }
      },
      detailsContainer: {
        style: {
          paddingRight:0,
          paddingLeft:0,
        }
      },
		}

		return (
      <div>
        {this.drawOptions()}
				<Grid container
          direction='column'
          alignItems='stretch'
          spacing={8}
          {...inputs.deviceContainer}
          >
					<Grid item xs={12}>
						{this.drawTopItems()}
					</Grid>
					<Grid item xs={12} {...inputs.detailsContainer}>
            {this.drawDetails()}
					</Grid>
        </Grid>
      </div>
		);
	}
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(Device));
