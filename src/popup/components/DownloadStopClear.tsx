import React from 'react';
import { IconButton } from '@material-ui/core';
import { Cancel, Stop } from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default function DownloadInteraction(props: DownloadInteractionProps) {
  const classes = useStyles();

  switch (props.state) {
    case 'in_progress':
    case 'paused':
      return (
        <IconButton size='small' onClick={() => props.stopOne(props.url)}>
          <Stop className={classes.defaultIcon} />
        </IconButton>
      );
    default:
      return (
        <IconButton size='small' onClick={() => props.clearOne(props.url)}>
          <Cancel className={classes.defaultIcon} />
        </IconButton>
      );
  }
}

interface DownloadInteractionProps {
  url: string;
  state: DownloadState;
  clearOne: (url: string) => void;
  stopOne: (url: string) => void;
}
