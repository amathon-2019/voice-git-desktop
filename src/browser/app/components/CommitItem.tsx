import { ListItem, ListItemText } from '@material-ui/core';
import { format } from 'date-fns';
import React, { memo } from 'react';
import { GitCommitItem } from '../../../core/git';

interface Props {
  item: GitCommitItem;
}

function CommitItem({ item }: Props) {
  return (
    <ListItem>
      <ListItemText
        primary={item.summary}
        primaryTypographyProps={{
          color: 'textPrimary',
        }}
        secondary={`Commit at ${format(item.timestamp, 'yyyy-MM-dd HH:mm:ss')}`}
        secondaryTypographyProps={{
          color: 'textSecondary',
        }}
      />
    </ListItem>
  );
}

export default memo(CommitItem);
