import { Checkbox, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { memo } from 'react';
import { GitFileChange, GitFileChangeStatusTypes } from '../../../core/git';

interface Props {
  checked: boolean;
  fileChange: GitFileChange;
  onClick?: () => void;
}

function FileChangeItem({ checked, fileChange, onClick }: Props) {
  return (
    <ListItem dense={true} button={true} onClick={onClick}>
      <ListItemIcon>
        <Checkbox
          color="primary"
          edge="start"
          checked={checked}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText
        primary={fileChange.filePath}
        primaryTypographyProps={{
          color: 'textPrimary',
        }}
      />
      <ListItemIcon>
        <div
          dangerouslySetInnerHTML={{ __html: getIcon(fileChange.status) }}
        />
      </ListItemIcon>
    </ListItem>
  );
}

export default memo(FileChangeItem);

function getIcon(status: GitFileChangeStatusTypes): string {
  switch (status) {
    case GitFileChangeStatusTypes.NEW:
      // Green
      return `
            <svg width="20" height="20" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
                <path fill-rule="evenodd" fill="#4caf50" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>
            </svg>
            `;

    case GitFileChangeStatusTypes.MODIFIED:
      // Ember
      return `
            <svg width="20" height="20" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
                <path fill-rule="evenodd" fill="#ffc107" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>
            </svg>
            `;

    case GitFileChangeStatusTypes.RENAMED:
      // Blue
      return `
            <svg width="20" height="20" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
                <path fill-rule="evenodd" fill="#2196f3" d="M6 9H3V7h3V4l5 4-5 4V9zm8-7v12c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1zm-1 0H1v12h12V2z"></path>
            </svg>
            `;

    case GitFileChangeStatusTypes.REMOVED:
      // Red
      return `
            <svg width="20" height="20" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
                <path fill-rule="evenodd" fill="#e53935" d="M13 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 13H1V2h12v12zm-2-5H3V7h8v2z"></path>
            </svg>
            `;
  }
}
