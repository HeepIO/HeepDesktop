import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as Actions from '../../redux/actions'
import dateFormat from 'dateformat'


const mapStateToProps = (state, ownProps) => ({
  MOP: state.analytics[ownProps.deviceID][ownProps.element],
  numLabel: ownProps.element
})

class AnalyticsCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }

  chooseColor(controlVal) {
    if (controlVal != 0) {
      return "#ededed"
    } else {
      return "#004a8f"
    }
  }

  render () {
    var multiplier = 1.2;

    var inputs = {
      container: {
        style: {
          width: 1000,
          height: multiplier * 10,
          margin: 1,
          backgroundColor: this.state.selected ? "#dbdfdf" : "white",
          color: "white",
          position: "relative",

        },
        onMouseEnter: () => this.setState({selected: true}),
        onMouseLeave: () => this.setState({selected: false})
      },
      controlIDBox: {
        style: {
          left: 50 + 10*this.props.MOP.controlID,
          width: multiplier * 10,
          height: multiplier * 10,
          borderRadius: multiplier *  5,
          backgroundColor: this.chooseColor(this.props.MOP.controlValue),
          border: "2px solid #004a8f",
          //borderWidth: 2,
          //borderColor: "#004a8f",
          //borderStyle: "solid",
          position: "absolute",
        }
      },
      date: {
        style: {
          fontSize: 12,
          color: "black",
          position: "absolute",
          left: 110,
          top: -3
        }
      },
      numberLabel: {
        style: {
          fontSize: 12,
          left: 10,
          position: "absolute",
          color: "#414141",
          top: -3,
        }
      },
    }

    var dateFormatted = dateFormat(this.props.MOP.timeStamp, "UTC:dddd, mmmm dS, h:MM:ss:l TT");

    return (
      <div {...inputs.container}>
        <div {...inputs.numberLabel}>
          {this.props.numLabel}
        </div>
        <div {...inputs.controlIDBox}/>
        <div {...inputs.date}> {dateFormatted} </div>
      </div>
    );

  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnalyticsCard))
