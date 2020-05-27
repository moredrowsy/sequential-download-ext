import React from 'react';
import { IconButton } from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled } from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default function DownloadInteraction(props: DownloadInteractionProps) {
  const classes = useStyles();

  switch (props.state) {
    case 'complete':
      return (
        <IconButton
          disabled
          size='small'
          onClick={() => props.startOne(props.url)}
        >
          <PlayCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
    case 'in_progress':
      return (
        <IconButton size='small' onClick={() => props.pauseOne(props.url)}>
          <PauseCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
    default:
      return (
        <IconButton size='small' onClick={() => props.startOne(props.url)}>
          <PlayCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
  }
}

interface DownloadInteractionProps {
  url: string;
  state: DownloadState;
  pauseOne: (url: string) => void;
  startOne: (url: string) => void;
}
