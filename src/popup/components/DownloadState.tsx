import React from 'react';
import { CircularProgress } from '@material-ui/core';
import {
  AdjustRounded,
  CheckCircleRounded,
  ErrorRounded,
  PauseCircleOutlineRounded,
} from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default function DownlaodState(props: DownloadStateProps) {
  const classes = useStyles();

  switch (props.state) {
    case 'complete':
      return <CheckCircleRounded className={classes.iconComplete} />;
    case 'in_progress':
      return (
        <CircularProgress size={20} className={classes.iconCircleProgress} />
      );
    case 'interrupted':
      return <ErrorRounded color='error' />;
    case 'paused':
      return <PauseCircleOutlineRounded className={classes.defaultIcon} />;
    default:
      return <AdjustRounded className={classes.defaultIcon} />;
  }
}

interface DownloadStateProps {
  state: DownloadState;
}
