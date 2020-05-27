import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    // Popup
    root: {
      backgroundColor: '#3f51b5',
    },
    input: {
      color: 'white',
      paddingLeft: '5px',
      paddingRight: '5px',
    },
    gridTabs: { height: '100%' },
    tabs: {
      height: '35px',
      minHeight: '35px',
    },
    buttonGrid: {
      backgroundColor: '#5c6bc0',
      paddingBottom: '1px',
    },
    boxPanel: {
      backgroundColor: '#3f51b5',
      height: '300px',
      overflowY: 'scroll',
      overflowX: 'hidden',
    },

    // DownloadHeader
    downloadRoot: {
      backgroundColor: '#5c6bc0',
      paddingTop: '0px',
      paddingBottom: '1px',
    },
    checkbox: {
      margin: '-5px',
      marginLeft: '-10px',
    },
    downloadHeaderRow: {
      backgroundColor: '#3f51b5',
      paddingLeft: '5px',
      paddingRight: '5px',
    },

    // Download
    downloadRow: {
      backgroundColor: '#3f51b5',
      color: 'white',
      '&:hover': {
        background: '#5c6bc0',
      },
      paddingLeft: '5px',
      paddingRight: '5px',
    },
    itemName: {
      fontSize: '12px',
      overflow: 'hidden',
    },

    // DownloadState
    defaultIcon: {
      color: '#9fa8da',
    },
    iconComplete: {
      color: '#4caf50',
    },
    iconCircleProgress: {
      color: '#9fa8da',
      marginRight: '2px',
    },

    // DownloadUrl
    downloadUrl: {
      fontSize: '13px',
    },
  },
  {
    index: 1,
  }
);

export { useStyles };
