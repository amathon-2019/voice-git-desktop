import { List, makeStyles } from '@material-ui/core';
import React, { memo, useCallback, useEffect, useState } from 'react';
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

interface Props {
  onChange: (fileChanges: GitFileChange[]) => void;
}

function FileChangeList({ onChange }: Props) {
  const classes = useStyles([]);
  const [fileChanges, setFileChanges] = useState<GitFileChange[]>([]);
  const [checkedIndexes, setCheckedIndexes] = useState([]);

  const handleToggle = useCallback((index) => {
    setCheckedIndexes(indexes => {
      const i = indexes.findIndex(v => v === index);
      let nextIndexes;

      if (i === -1) {
        nextIndexes = [...indexes, index];
      } else {
        nextIndexes = [...indexes];
        nextIndexes.splice(i, 1);
      }

      const selectedFileChanges = fileChanges.filter((_, i) => nextIndexes.includes(i));
      onChange(selectedFileChanges);

      return nextIndexes;
    });
  }, [onChange]);

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

export default memo(FileChangeList);
