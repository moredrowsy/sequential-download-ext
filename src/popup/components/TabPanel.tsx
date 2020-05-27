import React from 'react';

import { useStyles } from '../styles/styles';

export default function TabPanel(props: TabPanelProps) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </div>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  index: any;
  value: any;
}
