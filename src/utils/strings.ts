export function shortenString(str: string, maxLength: number) {
  const half = maxLength / 2;
  if (str.length > maxLength)
    return `${str.slice(0, half)}...${str.slice(-half + 3)}`;
  else return str;
}
