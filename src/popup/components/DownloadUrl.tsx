import React from 'react';
import { Typography } from '@material-ui/core';

import { useStyles } from '../styles/styles';
import { ellipseStr } from '../../utils/strings';

export default React.memo((props: DownloadUrlProps) => {
  const classes = useStyles();
  const maxLen = 80;

  return (
    <Typography className={classes.itemName}>
      {ellipseStr(props.url, maxLen, 'in')}
    </Typography>
  );
}, areEqual);

// This component never needs to update
function areEqual() {
  return true;
}

interface DownloadUrlProps {
  url: string;
}
