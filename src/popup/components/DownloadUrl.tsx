import React from 'react';
import { shortenString } from '../../utils/strings';

export default function DownloadUrl(props: Props) {
  return (
    <React.Fragment>
      {shortenString(props.url, props.maxStringLength)}
    </React.Fragment>
  );
}

interface Props {
  url: string;
  maxStringLength: number;
}
