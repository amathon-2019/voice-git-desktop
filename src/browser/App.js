import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { createMuiTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Root, Header, Nav, Content, TabSample, TabSamples} from "./Layout";
import Recorder from "./Recorder.js";
import showHistory from "./Layout/showHistory.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AudioRecorder from 'react-audio-recorder';
import "react-tabs/style/react-tabs.css";

class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      isRecording: 0,
    };
  }
render(){
  return (
    <Fragment>
    <Tabs>
    <TabList>
      <Tab>History</Tab>
      <Tab>Commit</Tab>
    </TabList>

    <TabPanel>
      <h2>Show Git History</h2>

    </TabPanel>
    <TabPanel>
      <h2>Show Commit Message</h2>
      
      <div id="controls">

      <button id="recordButton">Record</button>
      <button id="pauseButton" disabled>Pause</button>
      <button id="stopButton" disabled>Stop</button>
        
    </div>  
      

    </TabPanel>
  </Tabs>
  
    </Fragment>
  );
}
}
const rootElement = document.getElementById("root");
render(<App />, rootElement);