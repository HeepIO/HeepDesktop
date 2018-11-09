import React from 'react'
import {HashRouter as Router, Route} from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../redux/actions'
import AsyncComponent from './AsyncComponent'

import Header from './AppBar'
import Auth from './account/Auth'
import Logout from './account/Logout'
import Loading from './Loading'
import UserAccount from './account/UserAccount'
import Designer from './designer/DeviceBuilder'
import Flowchart from './flowchart/Flowchart'
// import Analytics from './Analytics/AnalyticsMain'
import SearchAccessPointsForm from './SearchAccessPointsForm'
import Settings from './Settings'

import Theme from './Theme'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

const Analytics = () => <AsyncComponent moduleProvider={() => import(
	/* webpackChunkName: "analytics" */
  	/* webpackMode: "lazy" */
  	'./Analytics/AnalyticsMain')} />

const mapStateToProps = (state) => ({
	loginStatus: state.loginStatus,
})

class App extends React.Component {
	render() {

		const inputs = {
			container : {
				style: {
				    flexGrow: 1,
				    height: '100%',
				    zIndex: 1,
				    overflow: 'hidden',
				    position: 'relative',
				    display: 'flex',
				  }
			},
			content: {
				style: {
				    flexGrow: 1,
				    backgroundColor: 'white',
				    marginTop: 64,
				    width:'100%',
				    overflow: 'auto',
				  }
			}
	    }

	    var loggedInRoutes = [];

	    if (this.props.loginStatus) {
	    	loggedInRoutes.push(<Route path="/User" component={UserAccount} key="user"/>);
	    }

	    return(
			<Router >
		    	<MuiThemeProvider theme={Theme}>
			    	<div {...inputs.container}>
						<Route path="/" component={Header}/>
						<div {...inputs.content} >
							<Route exact path="/" component={Flowchart} key="Flow"/>
							<Route path="/Classic" component={Flowchart} key="Flowchart"/>
							<Route path="/Settings" component={Settings} key="Settings"/>
							<Route path="/Designer" component={Designer} key="Designer"/>
							<Route exact path="/auth" component={Auth}/>
							<Route path="/Analytics/:deviceID?" component={Analytics} key="Analytics"/>
							<Route path="/AccessPoints" component={SearchAccessPointsForm} key="searchAccessPoints"/>
							{loggedInRoutes}
						</div>
				    </div>
				</MuiThemeProvider>
			</Router>);

	}
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
