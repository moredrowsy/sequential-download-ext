import React from 'react';
import { CircularProgress } from '@material-ui/core';
import {
  AdjustRounded,
  CheckCircleRounded,
  ErrorRounded,
  RotateRight,
} from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default React.memo((props: DownloadStateProps) => {
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
      return <RotateRight className={classes.defaultIcon} />;
    default:
      return <AdjustRounded className={classes.defaultIcon} />;
  }
});

interface DownloadStateProps {
  state: DownloadState;
}
