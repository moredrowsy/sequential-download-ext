import React from 'react';
import { Checkbox, Grid, Typography } from '@material-ui/core';

import { useStyles } from '../styles/styles';
import DownloadUrl from './DownloadUrl';
import DownloadState from './DownloadState';
import DownloadPlayPause from './DownloadPlayPause';
import DownloadStopClear from './DownloadStopClear';

function Item(props: DownloadProps) {
  const classes = useStyles();
  const maxStringLength = 80;

  return (
    <Grid container className={classes.downloadRoot}>
      <Grid container className={classes.downloadRow} alignItems='center'>
        <Grid item>
          <Checkbox
            id={props.url}
            checked={props.isChecked}
            value={props.url}
            onChange={props.toggleCheck}
            className={classes.checkbox}
          />
        </Grid>
        <Grid item xs={true}>
          <Typography className={classes.itemName}>
            <DownloadUrl url={props.url} maxStringLength={maxStringLength} />
          </Typography>
        </Grid>
        <Grid item>
          <DownloadState state={props.state} />
        </Grid>
        <Grid item>
          <DownloadPlayPause
            url={props.url}
            state={props.state}
            pauseOne={props.pauseOne}
            startOne={props.startOne}
          />
        </Grid>
        <Grid item>
          <DownloadStopClear
            url={props.url}
            state={props.state}
            clearOne={props.clearOne}
            stopOne={props.stopOne}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function areEqual(prevProps: DownloadProps, nextProps: DownloadProps) {
  if (
    prevProps.isChecked === nextProps.isChecked &&
    prevProps.state === nextProps.state
  )
    return true;
  else return false;
}

export default React.memo(Item, areEqual);

interface DownloadProps extends Download {
  toggleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pauseOne: (url: string) => void;
  startOne: (url: string) => void;
  clearOne: (url: string) => void;
  stopOne: (url: string) => void;
}
