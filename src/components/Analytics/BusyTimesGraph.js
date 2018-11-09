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

class BusyTimesGraph extends React.Component {
  
  render () {

    var times = [];

    for(var i=0;i<24;i++){

      if (i == 0) {
        times.push(12 + " AM");

      } else if (i < 12) {

        times.push(i + " AM");

      } else if (i == 12) {
        times.push(12 + " PM");

      } else {

        times.push((i - 12) + " PM");
      }
    }

    var data = [
      {
        x: times, 
        y: this.props.dailyActivity,
        mode: 'lines+markers',
        type: 'scatter',
        line: {shape: 'spline'}
      }
    ];


    var layout = {
        width: 700,
        height: 300,
        title: 'Most Active Times'
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BusyTimesGraph))


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

  var hourCounters = new Array(24).fill(0);

  for (var i in allTimes) {
    var keydate = new Date(allTimes[i])
    var key = keydate.getUTCHours() ;
    hourCounters[key] += 1;

  }

  return hourCounters
}
