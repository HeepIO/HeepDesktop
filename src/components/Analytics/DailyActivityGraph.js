import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../../redux/actions'
import Plot from 'react-plotly.js'
import _ from 'underscore'
import dateFormat from 'dateformat'

import AnalyticsCard from './AnalyticsCard'


const mapStateToProps = (state, ownProps) => ({
  dailyActivity: getDailyActivity(state, ownProps)
})

class DailyActivityGraph extends React.Component {
  
  render () {

    var data = [
      {
        x: Object.keys(this.props.dailyActivity),
        y: Object.values(this.props.dailyActivity),
        type: 'bar',
        marker: {
          color: Object.values(this.props.dailyActivity),
          size: Array(Object.values(this.props.dailyActivity)).fill(25)
        }
      }
    ];

    var layout = {
        width: 700,
        height: 300,
        title: 'Daily Activity'
      }

    return (
    <Plot
      data={data} 

      layout={layout}
    />
  );

  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DailyActivityGraph))


const getAnalyticsSeries = (state, ownProps, key) => {

  if ("analytics" in state) {
    if (ownProps.deviceID.toString() in state.analytics) {
      return Array.from(Object.keys(state.analytics[ownProps.deviceID]), x => state.analytics[ownProps.deviceID][x][key]);
    }
  }

  return []
}

const getDailyActivity = (state, ownProps) => {
  var allTimes = getAnalyticsSeries(state, ownProps, 'timeStamp');

  var dateCounters = {};

  for (var i in allTimes) {
    var key = allTimes[i];

    if (key in dateCounters) {
      dateCounters[key] += 1;
    } else {
      dateCounters[key] = 1;
    }

  }

  return dateCounters
}
