import { Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import GithubLogin from './GithubLogin';
import LoadWorkspace from './LoadWorkspace';

export default function StartStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const goToOpenWorkspaceStep = useCallback(() => {
    setActiveStep(1);
  }, []);

  return (
    <div>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Login to GitHub</StepLabel>
          <StepContent>
            <GithubLogin onComplete={goToOpenWorkspaceStep}/>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Load workspace</StepLabel>
          <StepContent>
            <LoadWorkspace/>
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
}
