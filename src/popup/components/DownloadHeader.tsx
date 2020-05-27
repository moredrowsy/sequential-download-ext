import React from 'react';
import { Checkbox, IconButton, Grid, Tooltip } from '@material-ui/core';
import {
  Cancel,
  PauseCircleFilled,
  PlayCircleFilled,
  RemoveCircleRounded,
  Stop,
} from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default function DownloadHeader(props: DownloadHeaderProps) {
  const classes = useStyles();

  return (
    <Grid container className={classes.downloadRoot}>
      <Grid container className={classes.downloadHeaderRow} alignItems='center'>
        <Grid item>
          <Checkbox
            id='check-all'
            checked={props.isChecked}
            onChange={props.toggleCheckAll}
            className={classes.checkbox}
            disabled={props.isDisabled}
          />
        </Grid>
        <Grid item>
          <Tooltip title='Start Selected' placement='bottom'>
            <IconButton size='small' onClick={props.downloadThese}>
              <PlayCircleFilled className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Pause Selected' placement='bottom'>
            <IconButton size='small' onClick={props.pauseThese}>
              <PauseCircleFilled className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Stop Selected' placement='bottom'>
            <IconButton size='small' onClick={props.stopThese}>
              <Stop className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Clear Completed' placement='bottom'>
            <IconButton size='small' onClick={props.clearCompleted}>
              <RemoveCircleRounded className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip
            title='Clear Selected (including scheduled downloads)'
            placement='bottom'
          >
            <IconButton size='small' onClick={props.clearThese}>
              <Cancel className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface DownloadHeaderProps {
  isChecked: boolean;
  isDisabled: boolean;
  toggleCheckAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  downloadThese: () => void;
  pauseThese: () => void;
  stopThese: () => void;
  clearCompleted: () => void;
  clearThese: () => void;
}
