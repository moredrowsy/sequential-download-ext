import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled } from '@material-ui/icons';

import { useStyles } from '../styles/styles';

export default React.memo((props: DownloadPlayPauseProps) => {
  const classes = useStyles();

  // Pause download
  const pauseOne = useCallback(() => {
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Pause these items',
      data: [{ url: props.url, id: props.id, state: props.state }],
    };
    props.port.postMessage(msg);
  }, [props.state]);

  // Start download
  const startOne = useCallback(() => {
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Download these items',
      data: [{ url: props.url, id: props.id, state: props.state }],
    };
    props.port.postMessage(msg);
  }, [props.state]);

  switch (props.state) {
    case 'complete':
      return (
        <IconButton disabled size='small'>
          <PlayCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
    case 'in_progress':
      return (
        <IconButton size='small' onClick={pauseOne}>
          <PauseCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
    default:
      return (
        <IconButton size='small' onClick={startOne}>
          <PlayCircleFilled className={classes.defaultIcon} />
        </IconButton>
      );
  }
}, areEqual);

function areEqual(
  prevProps: DownloadPlayPauseProps,
  nextProps: DownloadPlayPauseProps
) {
  if (prevProps.id === nextProps.id && prevProps.state === nextProps.state) {
    return true;
  } else return false;
}

interface DownloadPlayPauseProps {
  url: string;
  id: DownloadId;
  state: DownloadState;
  port: browser.runtime.Port;
}
