import React from 'react';
import { Grid } from '@material-ui/core';

import { useStyles } from '../styles/styles';
import DownloadCheckbox from './DownloadCheckbox';
import DownloadUrl from './DownloadUrl';
import DownloadState from './DownloadState';
import DownloadPlayPause from './DownloadPlayPause';
import DownloadStopClear from './DownloadStopClear';

export default React.memo((props: DownloadProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.downloadRoot}>
      <Grid container className={classes.downloadRow} alignItems='center'>
        <Grid item>
          <DownloadCheckbox
            isChecked={props.isChecked}
            url={props.url}
            toggleCheck={props.toggleCheck}
          />
        </Grid>
        <Grid item xs={true}>
          <DownloadUrl url={props.url} />
        </Grid>
        <Grid item>
          <DownloadState state={props.state} />
        </Grid>
        <Grid item>
          <DownloadPlayPause
            url={props.url}
            id={props.id}
            state={props.state}
            port={props.port}
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
}, areEqual);

function areEqual(prevProps: DownloadProps, nextProps: DownloadProps) {
  // Prop's callbacks depend on parent's state setter for downloads object.
  // Thus, must compare parent's downloads object.
  // If number of keys in downloads object changed, then return false
  // to rerender and grab props' new callbacks so that the callacks
  // will use the new downloads object and state setter.
  if (
    prevProps.downloadsSize === nextProps.downloadsSize &&
    prevProps.isChecked === nextProps.isChecked &&
    prevProps.state === nextProps.state
  ) {
    return true;
  } else return false;
}

interface DownloadProps extends Download {
  downloadsSize: number;
  toggleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearOne: (url: string) => void;
  stopOne: (url: string) => void;
  port: browser.runtime.Port;
}
