import React                  from 'react';
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter }         from 'react-router-dom'
import PropTypes              from 'prop-types';

import Paper                                        from 'material-ui/Paper';
import Grid                                         from 'material-ui/Grid';
import GridList, { GridListTile, GridListTileBar }  from 'material-ui/GridList';
import IconButton                                   from 'material-ui/IconButton';
import StarBorderIcon                               from 'material-ui-icons/StarBorder';
import Typography                                   from 'material-ui/Typography';
import Button                                       from 'material-ui/Button'
import Hidden                                       from 'material-ui/Hidden';

import FileDownload from 'material-ui-icons/FileDownload';

import * as actions from '../../redux/actions'


var mapStateToProps = (state, ownProps) => ({
})


class DownloadPage extends React.Component { 

  checkBreakpoint() {

  }

  render() {
    
    return (
      <div 
        style={{
          margin: 20,
          flexGrow: 1
        }}
      >
        <Grid 
          container
          spacing={24}
          justify={'center'}
          alignItems={'center'}>
          <Hidden smUp>
            <Grid 
              item 
              md={3}
              lg={2}
              sm={4}
              xs={5}>
              <img 
                src="../src/assets/Heep_Gradient.png"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}/>
            </Grid>
          </Hidden>
          <Grid 
            item 
            sm={6}
            xs={10}>
            <Typography
              variant="display2" 
              gutterBottom
            >Download Heep App</Typography>
            <Typography
              variant='body1'
              paragraph>
              Build responsive, local-first control systems with the world's most powerful networking library.
            </Typography>
            <Typography
              variant='body1'
              paragraph>
              Heep is a protocol for developing responsive local networks. From Smart Homes to Vertical Farms, Heep powered embedded devices 
              are the robust, secure, performant backbone for your creations. Download the Heep App to link data sources (switches, sensors) 
              to data outputs (screens, lights, motors, and more). Start enchanting your world.
            </Typography>
            <Button 
              variant='raised'
              color='primary'
              size='large'
              onClick={()=>{console.log("DOWNLOAD")}}
            >
              <FileDownload
                style={{
                  marginRight: 10
                }}
              />
              Download
            </Button>
          </Grid>
          <Hidden only='xs'>
            <Grid 
              item 
              md={3}
              lg={2}
              sm={4}
              xs={5}>
              <img 
                src="../src/assets/Heep_Gradient.png"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}/>
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
    
  }
  
}


var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadPage))
