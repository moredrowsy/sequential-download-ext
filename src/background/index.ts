import browser from 'webextension-polyfill';
import { Mutex } from 'async-mutex';
import DownloadMap from '../utils/DownloadMap';

// GLOBAL DATA
const DOWNLOAD_MAP_MUTEX = new Mutex();
let DOWNLOAD_MAP = new DownloadMap();
let PORT: browser.runtime.Port;
let PORT_CONNECTED = false;
let STOP = false;

// listen for port messages
browser.runtime.onConnect.addListener((port) => {
  // Set PORT state on connect
  PORT_CONNECTED = true;
  PORT = port;

  port.onMessage.addListener(async (msg: any) => {
    if (msg.msg == 'Do you have downloads?') {
      const resp: PortMessage = {
        from: 'popup',
        msg: 'Here is your downloads',
        data: getDownloadMap(),
      };
      port.postMessage(resp);
    } else if (msg.msg == 'Save my downloads') {
      if (msg.data) {
        const map: Downloads = msg.data;
        saveDownloadMap(map);
      }
    } else if (msg.msg == 'Download all') {
      //
    } else if (msg.msg == 'Download these items') {
      if (msg.data) {
        const items: Download[] = msg.data;
        downloadThese(items);
      }
    } else if (msg.msg == 'Pause all') {
      //
    } else if (msg.msg == 'Pause these items') {
      if (msg.data) {
        const items: Download[] = msg.data;
        pauseThese(items);
      }
    } else if (msg.msg == 'Stop all') {
      stopAllDownloads();
    } else if (msg.msg == 'Stop these items') {
      if (msg.data) {
        const items: Download[] = msg.data;
        stopThese(items);
      }
    } else if (msg.msg == 'Clear these items') {
      if (msg.data) {
        const items: Download[] = msg.data;
        clearThese(items);
      }
    }
  });

  // Set PORT state on disconnect
  port.onDisconnect.addListener((port) => {
    PORT_CONNECTED = false;
  });
});

// One-time receive
// From popup.js -> background.js
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.from === 'popup' && msg.to === 'background') {
    console.log(
      `Received one-time request from ${msg.from}/${sender.id}.`,
      msg
    );
    return Promise.resolve({ msg: 'Background got your request!' });
  }
});

// Return DOWNLOAD_MAP list
function getDownloadMap() {
  return DOWNLOAD_MAP.getMap();
}

// Save downloads
function saveDownloadMap(map: Downloads) {
  DOWNLOAD_MAP.add(map);
}

// Start download on these items by setting state to 'active' or 'resume'
async function downloadThese(downloads: Download[]) {
  // Send signal to STOP other download instances
  STOP = true;

  // Wait for other functions to finish accessing/modifying DownloadMap
  const releaseDownloadMap = await DOWNLOAD_MAP_MUTEX.acquire();
  try {
    // Set url keys in DownloadMap to 'active' state for download
    for (const { url } of downloads) {
      const download = DOWNLOAD_MAP.get(url);

      if (download && download.state != 'complete') {
        // If download has ID, then it might be able to resume.
        if (download.id && download.state == 'paused')
          download.state = 'resume';
        // Else, mark as active to start download
        else download.state = 'active';
      }
    }
  } finally {
    // Release DownloadMap when finished modifying
    releaseDownloadMap();
  }

  // Signal to allow and start downloads
  STOP = false;
  startDownloads();
}

// Pause downloads on these (valid) items and set state to 'paused'
async function pauseThese(downloads: Download[]) {
  // Send signal to STOP other download instances
  STOP = true;

  // Wait for download to stop
  // Then reset all active downloads to inactive
  const releaseDownloadMap = await DOWNLOAD_MAP_MUTEX.acquire();
  try {
    for (const { url } of downloads) {
      const download = DOWNLOAD_MAP.get(url);

      // Try to pause 'in_progress' download
      if (download) {
        if (download.id && download.state == 'in_progress') {
          browser.downloads.pause(download.id).then(
            () => {
              download.state = 'paused';
              sendDownloadUpdates(url);
            },
            (e) => {}
          );
        } else if (download.state == 'active') {
          download.state = 'paused';
        }
      }
    }
  } finally {
    releaseDownloadMap();
  }

  // Signal to allow and resume non-stopped downloads
  STOP = false;
  startDownloads();
}

// Stop all downloads and reset all items to 'inactive'
async function stopAllDownloads() {
  // Send signal to STOP other download instances
  STOP = true;

  // Wait for download to stop
  // Then reset all active downloads to inactive
  const releaseDownloadMap = await DOWNLOAD_MAP_MUTEX.acquire();
  try {
    const urls = DOWNLOAD_MAP.keys();
    for (let url of urls) {
      const download = DOWNLOAD_MAP.get(url);

      if (download && download.state != 'inactive') {
        download.state = 'inactive';

        // If download has ID, then it is in_progress. Try to cancel
        if (download.id) {
          browser.downloads.cancel(download.id).then(
            () => sendDownloadUpdates(url),
            (e) => sendDownloadUpdates(url)
          );
        } else {
          sendDownloadUpdates(url);
        }
      }
    }
  } finally {
    releaseDownloadMap();
  }
}

// Stop an array of download items and reset them to 'inactive'
async function stopThese(downloads: Download[]) {
  // Send signal to STOP other download instances
  STOP = true;

  // Wait for download to stop
  // Then reset all active downloads to inactive
  const releaseDownloadMap = await DOWNLOAD_MAP_MUTEX.acquire();
  try {
    for (const { url } of downloads) {
      const download = DOWNLOAD_MAP.get(url);

      if (download && download.state != 'inactive') {
        download.state = 'inactive';

        // If download has ID, then it is in_progress. Try to cancel
        if (download.id) {
          browser.downloads.cancel(download.id).then(
            () => sendDownloadUpdates(url),
            (e) => sendDownloadUpdates(url)
          );
        } else {
          sendDownloadUpdates(url);
        }
      }
    }
  } finally {
    releaseDownloadMap();
  }

  // Signal to allow and resume non-stopped downloads
  STOP = false;
  startDownloads();
}

// Remove these items that are not 'in_progress' or 'paused'
function clearThese(downloads: Download[]) {
  for (const { url } of downloads) {
    const download = DOWNLOAD_MAP.get(url);

    if (
      download &&
      download.state != 'in_progress' &&
      download.state != 'paused'
    )
      DOWNLOAD_MAP.removeOne(url);
  }
}

// Download an array of urls
async function startDownloads() {
  // Lock DownloadMap when starting downloads
  const releaseDownloadMap = await DOWNLOAD_MAP_MUTEX.acquire();

  try {
    const interval = 3;
    let count = 0;
    const ids = []; // hold a list of download ids

    const urls = DOWNLOAD_MAP.keys();
    for (let url of urls) {
      // Stop downloads when global is set by popup.js
      if (STOP) break;

      const download = DOWNLOAD_MAP.get(url);

      if (download) {
        // If resume, try to resume. If resume fail, fall through
        if (download.id && download.state == 'resume') {
          try {
            const id = download.id;
            await browser.downloads.resume(id);
            ids.push(id);

            // Send popup.js that download is in_progress
            download.id = id;
            download.state = 'in_progress';
            sendDownloadUpdates(url);

            // Async wait for only a set of downloads to start
            ++count;
            if (count < interval) {
              onDownloadCompleteOrInterrupted(id, url);
            } else {
              await onDownloadCompleteOrInterrupted(id, url);
              count = 0;
            }

            continue; // Continue to next url when resume is successful
          } catch (e) {
            // Resume fail. Let it fall through to start new download
          }
        }

        // Start a new download
        if (download.state == 'active') {
          try {
            const id = await startDownload(url);
            ids.push(id);

            // Send popup.js that download is in_progress
            download.id = id;
            download.state = 'in_progress';
            sendDownloadUpdates(url);

            // Async wait for only a set of downloads to start
            ++count;
            if (count < interval) {
              onDownloadCompleteOrInterrupted(id, url);
            } else {
              await onDownloadCompleteOrInterrupted(id, url);
              count = 0;
            }
          } catch (e) {
            download.state = 'interrupted';
            sendDownloadUpdates(url);
          }
        }
      }
    }

    // Query download ids for state changes
    // because event listener does not fire on some fail, ie 403 error
    for (let id of ids) {
      browser.downloads
        .search({
          id: id,
        })
        .then(
          (downloads) => {
            for (let download of downloads)
              if (download.state === 'interrupted') {
                DOWNLOAD_MAP.setState(download.url, 'interrupted');
                sendDownloadUpdates(download.url);
              }
          },
          (e) => console.error(e)
        );
    }
  } finally {
    // Release DownloadMap when downloads finished or exit early
    releaseDownloadMap();
  }
}

function resumeDownload(download: Download) {
  return new Promise<number | undefined>((resolve, reject) => {
    if (download.id)
      browser.downloads.resume(download.id).then(
        () => {
          download.state = 'in_progress';
          sendDownloadUpdates(download.url);
          resolve(download.id);
        },
        () => reject(undefined)
      );
  });
}

// Download a single url
// Returns a Promise of download id when downlaod initiates
function startDownload(url: string) {
  return new Promise<number>((resolve, reject) =>
    browser.downloads
      .download({
        url: url,
        saveAs: false,
      })
      .then(
        (id) => resolve(id),
        (e) => reject(e)
      )
  );
}

// Returns a Promise when download complete or interrupted
// Additionally, send port message to popup.js with state updates
// Can use to force await when using a batch of downloads via loops
function onDownloadCompleteOrInterrupted(itemId: number, url: string) {
  return new Promise((resolve) => {
    browser.downloads.onChanged.addListener(function onChanged({ id, state }) {
      if (id === itemId && state && state.current !== 'in_progress') {
        // Remove listener when download is complete or interrupted
        browser.downloads.onChanged.removeListener(onChanged);

        // Update state
        DOWNLOAD_MAP.setState(url, state.current as DownloadState);

        // Send download updates to popup.js
        sendDownloadUpdates(url);

        // Resolve Promise
        resolve(state.current === 'complete');
      }
    });
  });
}

// Send this downlaod state update to popup.justify
function sendDownloadUpdates(url: string) {
  try {
    if (PORT_CONNECTED) {
      const resp: PortMessage = {
        from: 'background',
        msg: 'Download update',
        data: DOWNLOAD_MAP.get(url),
      };
      PORT.postMessage(resp);
    }
  } catch (e) {
    console.error(e);
  }
}
