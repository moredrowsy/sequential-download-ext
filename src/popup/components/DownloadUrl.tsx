import React from 'react';
import { ellipseStr } from '../../utils/strings';

export default function DownloadUrl(props: Props) {
  return (
    <React.Fragment>{ellipseStr(props.url, props.maxLen, 'in')}</React.Fragment>
  );
}

interface Props {
  url: string;
  maxLen: number;
}
