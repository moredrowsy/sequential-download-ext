export function ellipseStr(
  str: string,
  maxLength: number,
  pos: EllipsePos = 'post'
) {
  if (str.length > maxLength) {
    if (pos == 'post') return `${str.substr(0, maxLength - 3)}...`;
    else if (pos == 'in') {
      const half = maxLength / 2;
      return `${str.slice(0, half)}...${str.slice(-half + 3)}`;
    } else return `...${str.substr(3, maxLength - 3)}`;
  } else return str;
}

declare type EllipsePos = 'pre' | 'in' | 'post';
