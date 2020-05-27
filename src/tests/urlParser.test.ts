import { parseUrl } from '../utils/urlParser';

test('Fail on parsing empty string', () => {
  const str = String.raw``;
  const ans: string[] = [];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Parses string with no pattern', () => {
  const str = String.raw`http://www.example.com/images.jpg`;
  const ans = ['http://www.example.com/images.jpg'];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Parses string on one pattern', () => {
  const str = String.raw`http://www.example.com/images_[001:050].jpg`;
  const ans = ['http://www.example.com/images_', '001:050', '.jpg'];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Fail on missing open bracket on one pattern', () => {
  const str = String.raw`http://www.example.com/images_001:050].jpg`;
  const ans: string[] = [];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Fail on missing close bracket on one pattern', () => {
  const str = String.raw`http://www.example.com/images_[001:050.jpg`;
  const ans: string[] = [];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Parses string with escapes before and after pattern', () => {
  const str = String.raw`http://www.example.com/images_\[[001:050]\].jpg`;
  const ans = ['http://www.example.com/images_[', '001:050', '].jpg'];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Fail on missing open bracket with one escape', () => {
  const str = String.raw`http://www.example.com/images_\[001:050]\].jpg`;
  const ans: string[] = [];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Fail on missing close bracket with one escape', () => {
  const str = String.raw`http://www.example.com/images_\[[001:050\].jpg`;
  const ans: string[] = [];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});

test('Parses string with double escapes before and after pattern', () => {
  const str = String.raw`http://www.example.com/images_\\[001:050]\\.jpg`;
  const ans = ['http://www.example.com/images_\\', '001:050', '\\.jpg'];

  const parsed = parseUrl(str).map((t) => t['string']);
  expect(parsed).toEqual(ans);
});
