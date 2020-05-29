import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { Cancel, Stop } from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default React.memo((props: DownloadStopClearProps) => {
  const classes = useStyles();

  const clearOne = useCallback(() => {
    props.clearOne(props.url);
  }, [props.state]);

  const stopOne = useCallback(() => {
    props.stopOne(props.url);
  }, [props.state]);

  switch (props.state) {
    case 'in_progress':
    case 'paused':
      return (
        <IconButton size='small' onClick={stopOne}>
          <Stop className={classes.defaultIcon} />
        </IconButton>
      );
    default:
      return (
        <IconButton size='small' onClick={clearOne}>
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
