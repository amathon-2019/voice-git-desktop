import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { remote } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import StartStepper from './containers/StartStepper';
import './style.css';

const isDarkMode = remote.systemPreferences.isDarkMode();
const theme = createMuiTheme({
  palette: {
    type: isDarkMode ? 'dark' : 'light',
  },
});

document.documentElement.style.backgroundColor = theme.palette.background.paper;

const rootElement = document.getElementById('root')!;
render((
  <ThemeProvider theme={theme}>
    <StartStepper/>
  </ThemeProvider>
), rootElement);
