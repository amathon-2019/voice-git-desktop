import { Divider, makeStyles } from '@material-ui/core';
import React from 'react';
import Recorder from '../components/Recorder';
import FileChangeList from './FileChangeList';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

export default function PerformCommit() {
  const classes = useStyles([]);

  return (
    <div className={classes.container}>
      <FileChangeList/>
      <Divider variant="fullWidth"/>
      <Recorder/>
    </div>
  );
}
