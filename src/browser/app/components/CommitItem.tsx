import { ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { format } from 'date-fns';
import React, { memo, useCallback, useRef } from 'react';
import { GitCommitItem } from '../../../core/git';

interface Props {
  item: GitCommitItem;
  voice?: string;
}

function CommitItem({ item, voice }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const play = useCallback(() => {
    if (audioRef.current !== null) {
      const audio = audioRef.current;
      audio.play();
    }
  }, []);

  return (
    <ListItem>
      {voice ? (
        <>
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
          <ListItemSecondaryAction onClick={play}>
            <PlayArrowIcon />
            <audio ref={audioRef} src={voice} controls style={{ display: 'none' }} />
          </ListItemSecondaryAction>
        </>
      ) : (
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
      )}
    </ListItem>
  );
}

export default memo(CommitItem);
