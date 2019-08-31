import {
  createStyles,
  makeStyles,
  Paper,
  Theme,
  InputBase,
  IconButton,
  FormHelperText,
} from '@material-ui/core';
import { FolderOpenRounded } from '@material-ui/icons';
import * as React from 'react';
import { memo, useCallback, useState } from 'react';
import { IpcClient } from '../../../libs/ipc';

interface Props {
  onComplete?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openDirectory: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      cursor: 'pointer',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

const ipc = new IpcClient('workspace');

function LoadWorkspace({ onComplete }: Props) {
  const classes = useStyles([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openDialog = useCallback(async () => {
    const { dialog, BrowserWindow } = require('electron').remote;

    try {
      const { filePaths } = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        buttonLabel: 'Open',
        properties: ['openDirectory'],
      });

      if (filePaths.length === 0) {
        return;
      }

      const directoryPath = filePaths[0];
      await ipc.performAction('init', directoryPath);

      onComplete();
    } catch (error) {
      if (error && error.code === 'workspace.pathNotExists') {
        setErrorMessage('Invalid path');
      } else if (error && error.code === 'workspace.invalidRepository') {
        setErrorMessage('Directory is not git repository');
      }
    }
  }, [onComplete]);

  return (
    <div>
      {errorMessage != null ? <FormHelperText error={true}>{errorMessage}</FormHelperText> : null}
      <Paper className={classes.openDirectory} onClick={openDialog}>
        <InputBase
          className={classes.input}
          placeholder="Open local repository..."
          readOnly={true}
        />
        <IconButton className={classes.iconButton} aria-label="open directory">
          <FolderOpenRounded />
        </IconButton>
      </Paper>
    </div>
  )
}

export default memo(LoadWorkspace);
