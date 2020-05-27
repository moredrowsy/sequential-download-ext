declare interface PortMessage {
  from: string;
  msg: string;
  data?: any;
}

declare interface Downloads {
  [key: string]: Download;
}

declare interface Download {
  url: string;
  id: DownloadId;
  state: DownloadState;
  isChecked: boolean;
}

declare type DownloadId = number | undefined;

/**
 * State flow
 * inactive -> active -> in_progress -> complete
 *                                   -> interrupted (error) -> active
 *                                   -> paused -> resume | active
 *
 * Cancelled/paused sometime can not resume, so set to active to restart.
 */

declare type DownloadState =
  | 'inactive' // waiting for signal to become active
  | 'active' // marked as need to downlaod
  | 'in_progress' // is downloading
  | 'complete' // has completed after in_progress
  | 'interrupted' // did not complete because of error after in_progress
  | 'paused' // download paused after in_progress
  | 'resume'; // marked as need to download after paused
