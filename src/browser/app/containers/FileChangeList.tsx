import { List, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { GitFileChange } from '../../../core/git';
import { fetchFileChanges } from '../remotes/git';
import { fetchWorkspacePath } from '../remotes/workspace';
import FileChangeItem from '../components/FileChangeItem';

async function getFileChanges() {
  const workspaceDir = await fetchWorkspacePath();
  return await fetchFileChanges(workspaceDir);
}

const useStyles = makeStyles(() => ({
  container: {
    flex: '1 1 auto',
    minHeight: '1px',
    overflowY: 'auto',
  },
}));

export default function FileChangeList() {
  const classes = useStyles([]);
  const [fileChanges, setFileChanges] = useState<GitFileChange[]>([]);
  const [checkedIndexes, setCheckedIndexes] = useState([]);

  const handleToggle = useCallback((index) => {
    setCheckedIndexes(indexes => {
      const i = indexes.findIndex(v => v === index);

      if (i === -1) {
        return [...indexes, index];
      } else {
        const newIndexes = [...indexes];
        newIndexes.splice(i, 1);

        return newIndexes;
      }
    });
  }, []);

  useEffect(() => {
    getFileChanges().then((result) => {
      setFileChanges(result);
    });
  }, []);

  return (
    <div className={classes.container}>
      <List>
        {fileChanges.map((fileChange, index) => (
          <FileChangeItem
            key={fileChange.filePath}
            fileChange={fileChange}
            checked={checkedIndexes.includes(index)}
            onClick={() => handleToggle(index)}
          />
        ))}
      </List>
    </div>
  );
}
