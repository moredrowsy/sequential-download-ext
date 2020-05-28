import browser from 'webextension-polyfill';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Input,
  Tabs,
  Tab,
  Tooltip,
} from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';
import urlParser from '../utils/urlParser';

import './Popup.css';
import { useStyles } from './styles/styles';
import TabPanel from './components/TabPanel';
import Download from './components/Download';
import DownloadHeader from './components/DownloadHeader';

export default function Popup() {
  const classes = useStyles();
  const port = browser.runtime.connect(undefined, { name: 'popup' });
  const [tabValue, setTabValue] = useState(0);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  // Switch tab panel
  const tabSwitch = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  // Toggle one item to check/uncheck
  const toggleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckedAll(false);
      downloads[e.target.value].isChecked = !downloads[e.target.value]
        .isChecked;
      setDownloads({ ...downloads });
    },
    [Object.keys(downloads).length]
  );

  // Toggle all items to check/unchecked state
  const toggleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    if (isCheckedAll)
      for (let url in downloads) downloads[url].isChecked = false;
    else for (let url in downloads) downloads[url].isChecked = true;
    setDownloads({ ...downloads });
  };

  // Disable isCheckedAll if list is empty
  const canDisableIsCheckedAll = (length: number) => {
    if (length == 0) setIsCheckedAll(false);
  };

  // Send port message to background.js to download an array of checked items
  const downloadThese = () => {
    // Filter a checked array of items
    const items = Object.values(downloads).filter(
      (value) => value.isChecked && value.state != 'complete'
    );

    // Send port message
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Download these items',
      data: items,
    };
    port.postMessage(msg);
  };

  // Send port message to background.js to pause an array of checked items
  const pauseThese = () => {
    // Filter a checked array of items
    const items = Object.values(downloads).filter(
      (value) => value.isChecked && value.state != 'complete'
    );

    // Send port message
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Pause these items',
      data: items,
    };
    port.postMessage(msg);
  };

  // Send port message to background.js to stop an array of checked items
  const stopThese = () => {
    // Filter a checked array of items
    const items = Object.values(downloads).filter(
      (value) => value.isChecked && value.state != 'complete'
    );

    // Send port message
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Stop these items',
      data: items,
    };
    port.postMessage(msg);
  };

  // Send port message to background.js to remove an array of checked items
  const clearThese = () => {
    // Filter and remove items that are not 'in_progress' or 'paused'
    const items: Download[] = [];
    Object.keys(downloads).map((url) => {
      const download = downloads[url];
      if (
        download.isChecked &&
        download.state != 'in_progress' &&
        download.state != 'paused'
      ) {
        items.push(download);
        delete downloads[url];
      }
    });

    // Send port message
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Clear these items',
      data: items,
    };
    port.postMessage(msg);

    canDisableIsCheckedAll(Object.keys(downloads).length);
    setDownloads({ ...downloads });
  };

  // Send port message to background.js to clear an array of completed items
  const clearCompleted = () => {
    // Filter and remove items that are 'complete'
    const items: Download[] = [];
    Object.keys(downloads).map((url) => {
      if (downloads[url].state == 'complete') {
        items.push(downloads[url]);
        delete downloads[url];
      }
    });

    // Send port message
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Clear these items',
      data: items,
    };
    port.postMessage(msg);

    canDisableIsCheckedAll(Object.keys(downloads).length);
    setDownloads({ ...downloads });
  };

  // Remove one download (must be called after stopOne)
  const clearOne = useCallback(
    (url: string) => {
      // Send port message
      const msg: PortMessage = {
        from: 'popup',
        msg: 'Clear these items',
        data: [downloads[url]],
      };
      port.postMessage(msg);

      delete downloads[url];
      canDisableIsCheckedAll(Object.keys(downloads).length);
      setDownloads({ ...downloads });
    },
    [Object.keys(downloads).length]
  );

  // Stop one download
  const stopOne = useCallback(
    (url: string) => {
      // Send port message
      const msg: PortMessage = {
        from: 'popup',
        msg: 'Stop these items',
        data: [downloads[url]],
      };
      port.postMessage(msg);
      console.log(downloads[url]);
    },
    [Object.keys(downloads).length]
  );

  // Parses url into sequences
  const parse = () => {
    const urlInput: HTMLInputElement = document.getElementById(
      'url-input'
    ) as HTMLInputElement;
    if (urlInput) {
      const urls = urlParser(urlInput.value);
      const dl: Downloads = {};

      for (let url of urls) {
        if (!(url in downloads))
          dl[url] = {
            url: url,
            id: undefined,
            state: 'inactive',
            isChecked: false,
          };
      }

      setDownloads({ ...downloads, ...dl });
      saveDownloadsToBackground({ ...dl });
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // On 'Enter' key down, parse string in input
    if (e.keyCode === 13) parse();
  };

  // Save downloads to background.js
  const saveDownloadsToBackground = async (data: Downloads) => {
    const msg: PortMessage = {
      from: 'popup',
      msg: 'Save my downloads',
      data: data,
    };
    port.postMessage(msg);
  };

  // Ask background.js for downloads if it has any
  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs: browser.tabs.Tab[]) => {
        const msg: PortMessage = {
          from: 'popup',
          msg: 'Do you have downloads?',
          data: tabs[0],
        };
        port.postMessage(msg);
      })
      .catch((e) => console.error(e));
  }, []);

  // Listening for port messages from background.js
  useEffect(() => {
    port.onMessage.addListener((msg: any) => {
      if (msg.msg == 'Here is your downloads') setDownloads(msg.data);
      else if (msg.msg == 'Download update') {
        if (msg.data && msg.data.url && msg.data.url in downloads) {
          if (
            downloads[msg.data.url].id != msg.data.id ||
            downloads[msg.data.url].state != msg.data.state
          ) {
            downloads[msg.data.url].id = msg.data.id;
            downloads[msg.data.url].state = msg.data.state;
            setDownloads({ ...downloads });
          }
        }
      }
    });
  });

  return (
    <Box width={640} className={classes.root}>
      <Grid container>
        <Grid item xs={true}>
          {/* APPBAR WITH TAB BUTTONS */}
          <AppBar position='static'>
            <Tabs
              value={tabValue}
              onChange={tabSwitch}
              aria-label='simple tabs example'
              variant='fullWidth'
              className={classes.tabs}
            >
              <Tab
                label='Downloads'
                className={classes.tabs}
                {...a11yProps(0)}
              />
              <Tab label='Log' className={classes.tabs} {...a11yProps(1)} />
            </Tabs>
          </AppBar>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={true} className={classes.gridTabs}>
          {/* TAB PANEL DISPLAY */}
          <TabPanel value={tabValue} index={0}>
            <DownloadHeader
              isChecked={isCheckedAll}
              isDisabled={Object.keys(downloads).length > 0 ? false : true}
              toggleCheckAll={toggleCheckAll}
              downloadThese={downloadThese}
              pauseThese={pauseThese}
              stopThese={stopThese}
              clearThese={clearThese}
              clearCompleted={clearCompleted}
            />
            <Box p={0} className={classes.boxPanel}>
              {Object.keys(downloads).map((key) => (
                <Download
                  key={key}
                  {...downloads[key]}
                  downloads={downloads}
                  toggleCheck={toggleCheck}
                  clearOne={clearOne}
                  stopOne={stopOne}
                  port={port}
                />
              ))}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box p={0} className={classes.boxPanel}>
              Logging
            </Box>
          </TabPanel>
        </Grid>
      </Grid>
      {/* URL INPUT */}
      <Grid container alignItems='center'>
        <Grid item xs={true}>
          <Input
            id='url-input'
            placeholder='http://www.example.com/image_[001:050].jpg'
            className={classes.input}
            fullWidth
            margin={'dense'}
            type='url'
            onKeyDownCapture={onKeyDownInput}
          />
        </Grid>
        <Grid item>
          <Tooltip title='PARSE' placement='left'>
            <IconButton size='small' onClick={parse}>
              <DoubleArrow className={classes.defaultIcon} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

// Tab switching props to set index
function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
