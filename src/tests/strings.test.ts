import { ellipseStr } from '../utils/strings';

test('Empty string should return empty', () => {
  const maxLen = 80;
  const str = '';
  const ans = '';

  const ellipsedStr = ellipseStr(str, maxLen);
  expect(ellipsedStr).toEqual(ans);
  expect(ellipsedStr.length).toBe(ans.length);
});

test('Prefix ellipse on string > maxLen = 80', () => {
  const maxLen = 80;
  const str =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis. Laborum dignissimos o';
  const ans =
    '...em ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis. L';

  const ellipsedStr = ellipseStr(str, maxLen, 'pre');
  expect(ellipsedStr).toEqual(ans);
  expect(ellipsedStr.length).toBe(maxLen);
});

test('Postfix ellipse on string > maxLen = 80', () => {
  const maxLen = 80;
  const str =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis. Laborum dignissimos o';
  const ans =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis...';

  const ellipsedStr = ellipseStr(str, maxLen, 'post');
  expect(ellipsedStr).toEqual(ans);
  expect(ellipsedStr.length).toBe(maxLen);
});

test('Infix ellipse on string > maxLen = 80', () => {
  const maxLen = 80;
  const str =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis. Laborum dignissimos o';
  const ans =
    'Lorem ipsum dolor sit amet consectetur a...nt, reiciendis. Laborum dignissimos o';

  const ellipsedStr = ellipseStr(str, maxLen, 'in');
  expect(ellipsedStr).toEqual(ans);
  expect(ellipsedStr.length).toBe(maxLen);
});

test('Prefix, infix, postfix ellipse on string < maxLen = 80 should receive original string', () => {
  const maxLen = 80;
  const str =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, reiciendis. ';

  const prefixEllipsedStr = ellipseStr(str, maxLen, 'pre');
  expect(prefixEllipsedStr).toEqual(str);
  expect(prefixEllipsedStr.length).toBe(str.length);

  const infixEllipsedStr = ellipseStr(str, maxLen, 'in');
  expect(infixEllipsedStr).toEqual(str);
  expect(infixEllipsedStr.length).toBe(str.length);

  const postfixEllipsedStr = ellipseStr(str, maxLen, 'post');
  expect(postfixEllipsedStr).toEqual(str);
  expect(postfixEllipsedStr.length).toBe(str.length);
});
