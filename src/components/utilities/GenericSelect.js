import React from 'react'
import {HashRouter as Router, Route} from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../redux/actions_designer'
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { Select }  from 'material-ui'
import { FormControl, FormHelperText } from 'material-ui/Form';

export default class GenericSelect extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
	    return (

	    	<FormControl style={{
			    width: this.props.width ? this.props.width : '100%' ,
			    margin: 4
			  }}>
	    	  <InputLabel htmlFor="helper" >{this.props.title}</InputLabel>
	    	  <Select
	    	    value={this.props.defaultValue}
	    	    onChange={ (event) => {this.props.onChange(event.target.value)}}
	    	    input={<Input name="helper" id="helper" />}
	    	  >
	    	    {Array.isArray(this.props.options) ? 
	    	    	this.props.options.map((thisKey) => (
		    	      <MenuItem value={thisKey} key={thisKey}>{thisKey}</MenuItem>
		    	    )) :
		    	    Object.keys(this.props.options).map((thisKey) => (
		    	      <MenuItem value={this.props.options[thisKey]} key={thisKey}>{thisKey}</MenuItem>
		    	    )) 
	    	    }
	    	  </Select>
	    	  <FormHelperText>{this.props.helperText}</FormHelperText>
	    	</FormControl>

	    )
	    
	}
}