import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Popup from './Popup';

ReactDOM.render(
  // StrictMode renders components TWICE (on development but not production)
  // in order to detect/warn any problems with your code.
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
