import { createMuiTheme } from '@material-ui/core';
import { blue, pink } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import { remote } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import './style.css';

const isDarkMode = remote.systemPreferences.isDarkMode();
const theme = createMuiTheme({
  palette: {
    type: isDarkMode ? 'dark' : 'light',
    primary: blue,
    secondary: pink,
  },
});

document.documentElement.style.backgroundColor = theme.palette.background.paper;

const rootElement = document.getElementById('root')!;
render((
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>
), rootElement);
