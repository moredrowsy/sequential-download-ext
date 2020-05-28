import React from 'react';
import { Checkbox } from '@material-ui/core';

import { useStyles } from '../styles/styles';

export default React.memo((props: DownloadCheckboxProps) => {
  const classes = useStyles();

  return (
    <Checkbox
      id={props.url}
      checked={props.isChecked}
      value={props.url}
      onChange={props.toggleCheck}
      className={classes.checkbox}
    />
  );
});

interface DownloadCheckboxProps {
  isChecked: boolean;
  url: string;
  toggleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
