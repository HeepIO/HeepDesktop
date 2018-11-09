import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../redux/actions'

var mapStateToProps = (state, ownProps) => ({
  text: ownProps.text,
  onChange: ownProps.onChange
})

class EditTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text
    }
  }

  updateName(change) {
    this.setState({ 
      text: change.target.value
    });

    this.props.onChange(change.target.value)
  }


  render() {

    const inputs = {
      text: {
        style: {
          height: '100%',
          width: '80%',
          left: '10%',
          top: '10%',
          backgroundColor: "transparent",
          textAlign: "left",
          borderWidth: 0,
          outline: "none"
        },
        type: "text",
        value: this.state.text,
        onChange: (change) => {this.updateName(change)}
      }
    }


    return (<div > 
                <input {...inputs.text}/>
            </div>
    );
  }
}

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTextBox)