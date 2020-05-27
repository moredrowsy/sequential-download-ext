/**
 * Parses an url and produces an array of permuations based on pattern.
 * Patterns can be [001:005], [005:001],[ 00a:00z], or [00z:00a]
 * Use backslash to escape opening/closing brackets.
 *
 * Example
 * -------
 * url = String.raw`http://www.example.com/images_[001:050].jpg`;
 * results = array of 50 strings from 001 to 050
 *
 * @param {string}  url - Url string to parse
 * @return {string[]} An array of url token strings
 */
export default function urlParser(url: string): string[] {
  const tokens = parseUrl(url);
  const urls = genUrls(tokens);
  return urls;
}

interface UrlToken {
  type: 'prefix' | 'infix' | 'postfix';
  string: string;
}

/**
 * Splits the url with [ and ] bracket delimiters with pattern inside brackets.
 * Patterns can be [001:005], [005:001],[ 00a:00z], or [00z:00a]
 * Use backslash to escape opening/closing brackets.
 *
 * Example
 * -------
 * url = String.raw`http://www.example.com/images_[001:050].jpg`;
 * results = ['http://www.example.com/images_', '001:050', '.jpg']
 *
 * @param {string}  url - Url string to parse
 * @return {UrlToken[]} An array of url token strings
 */
export function parseUrl(url: string): UrlToken[] {
  const esc = '\\';
  const lBracket = '[';
  const rBracket = ']';
  let results: UrlToken[] = [];

  if (url) {
    let lBracketCount = 0;
    let rBracketCount = 0;
    let parsed = '';

    for (let i = 0; i < url.length; ++i) {
      // Opening bracket
      if (url[i] == lBracket) {
        results.push({ type: 'prefix', string: parsed });
        parsed = '';
        ++lBracketCount;
      }
      // Closing bracket
      else if (url[i] == rBracket) {
        results.push({ type: 'infix', string: parsed });
        parsed = '';
        ++rBracketCount;
      }
      // Escape character
      else if (url[i] == esc) {
        ++i;
        parsed += url[i];
      } else {
        parsed += url[i];
      }
    }
    results.push({ type: 'postfix', string: parsed });

    if (lBracketCount != rBracketCount) results = [];
  }

  return results;
}

/**
 * Generate an array of sequences from a given pattern string.
 * Patterns can be 001:005, 005:001, 00a:00z, or 00z:00a
 * Function will determine if it's decrement or increment based on pattern.
 *
 * @param {string}  str - String pattern 001:005, 005:001, 00a:00z, or 00z:00a
 * @param {string=} inc - A non-negative increment value
 * @return {string[]} An array of pattern sequence strings
 */
export function genSequences(str: string, inc?: number): string[] {
  inc = inc ? Math.abs(inc) : 1;
  let strings = [];
  const [start, end] = str.split(':');

  if (start) {
    const padLen = start.length;
    const padChar = start.length == 1 ? undefined : start[0];

    if (end) {
      // When both start and end are numbers
      if (!isNaN(Number(start)) && !isNaN(Number(end))) {
        let start_num = Number(start);
        let end_num = Number(end);

        // Check if positive or negative sequence
        if (start_num > end_num) inc = -inc;

        // Generate sequences
        for (let i = start_num; i != end_num; i += inc)
          strings.push(i.toString().padStart(padLen, padChar));
        strings.push(end_num.toString().padStart(padLen, padChar));
      }
      // When both start and end are letters
      else {
        let start_char = start.charCodeAt(start.length - 1);
        let end_char = end.charCodeAt(end.length - 1);

        // Check if positive or negative sequence
        if (start_char > end_char) inc = -inc;

        // Generate sequences
        for (let c = start_char; c != end_char; c += inc)
          strings.push(String.fromCharCode(c).padStart(padLen, padChar));
        strings.push(String.fromCharCode(end_char).padStart(padLen, padChar));
      }
    } else {
      strings.push(str);
    }
  }

  return strings;
}

/**
 * Generate an array of sequences from a given pattern string.
 * Patterns can be 001:005, 005:001, 00a:00z, or 00z:00a
 * Function will determine if it's decrement or increment based on pattern.
 *
 * @param {UrlToken[]}  strings - An array of url token strings
 * @return {string[]} An array of url sequence strings
 */
export function genUrls(tokens: UrlToken[]): string[] {
  if (tokens.length == 0) return [];

  let urls: string[] = [''];

  for (let token of tokens) {
    if (token.type == 'infix') {
      const sequences = genSequences(token.string);

      let temp: string[] = [];
      for (let url of urls) for (let seq of sequences) temp.push(url + seq);
      urls = temp;
    } else if (token.type == 'prefix' || token.type == 'postfix')
      for (let i = 0; i < urls.length; ++i) urls[i] += token.string;
  }

  return urls;
}
