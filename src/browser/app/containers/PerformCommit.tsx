import { Button, Divider, makeStyles } from '@material-ui/core';
import { readFile } from 'fs-extra';
import React, { useCallback, useState } from 'react';
import { GitFileChange } from '../../../core/git';
import { API_URL } from '../../core/api';
import { httpClient } from '../../core/http';
import FileChangeList from './FileChangeList';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  action: {
    flex: 'none',
    height: '200px',
  },
}));

export default function PerformCommit() {
  const classes = useStyles([]);
  const [fileChanges, setFileChanges] = useState<GitFileChange[]>([]);
  const handleChangeFileChanges = useCallback((changes) => {
    setFileChanges(changes);
  }, []);

  const uploadIt = useCallback(async () => {
    const file = await readFile('/Users/seokju.me/test.m4a');
    const arrayBuf = Uint8Array.from(file).buffer;
    const fd = new FormData();
    fd.append('hashCode', '3051416526d343579fabcac7d56ee9cca0a3027a');
    fd.append('voice', new Blob([arrayBuf]));

    console.log(fd);

    const response = await httpClient.post(`${API_URL}/commit/1/4`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
  }, []);

  return (
    <div className={classes.container}>
      <FileChangeList onChange={handleChangeFileChanges}/>
      <Divider variant="fullWidth"/>
      <div className={classes.action}>
        <Button onClick={uploadIt}>Commit</Button>
      </div>
    </div>
  );
}
