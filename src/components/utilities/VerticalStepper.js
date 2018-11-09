import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

class VerticalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    if (this.state.activeStep == this.props.steps.length - 1) {
      this.props.completionCallback()
    } 

    this.setState({
      activeStep: this.state.activeStep + 1,
    });
    
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  generateStepContent(classes, activeStep, stepContent) {

    return (
      <div>
        <Typography>{stepContent.description}</Typography>
        {stepContent.form}
        <div className={classes.actionsContainer}>
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={this.handleBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="raised"
              color="primary"
              onClick={this.handleNext}
              className={classes.button}
            >
              {activeStep === this.props.steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>


    )
  }

  completedResponse(classes, activeStep) {
    return (
      <div>
        {activeStep === this.props.steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} nonLinear  orientation="vertical">
          {this.props.steps.map((stepContent, index) => {
            return (
              <Step key={stepContent.title}>

                <StepLabel>{stepContent.title}</StepLabel>
                <StepContent>
                  {this.generateStepContent(classes, activeStep, stepContent)}
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {this.completedResponse(classes, activeStep)}
        
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);
