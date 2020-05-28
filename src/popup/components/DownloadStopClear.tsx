import React from 'react';
import { IconButton } from '@material-ui/core';
import { Cancel, Stop } from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default React.memo((props: DownloadStopClearProps) => {
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
});

interface DownloadStopClearProps {
  url: string;
  state: DownloadState;
  clearOne: (url: string) => void;
  stopOne: (url: string) => void;
}
