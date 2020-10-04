import { join } from '../src';

describe('join', () => {

  it('Returns empty string if all arguments are empty', () => {
    const expected = '';
    const actual = join('', '', '');
    expect(actual).toBe(expected);
  });

  it('Returns empty string if the separator is specified but the two parts are empty', () => {
    const expected = '';
    const actual = join('', '&', '');
    expect(actual).toBe(expected);
  });

  it('Removes the separator at the beginning of the second part if the first part is empty', () => {
    const expected = 'second-part';
    const actual = join('', '&', '&second-part');
    expect(actual).toBe(expected);
  });

  it('Removes the separator at the end of the first part if the second part is empty', () => {
    const expected = 'first-part';
    const actual = join('first-part&', '&', '');
    expect(actual).toBe(expected);
  });

  it('If neither part contains the separator at the boundary, it joins them using it', () => {
    const expected = 'first,second';
    const actual = join('first', ',', 'second');
    expect(actual).toBe(expected);
  });

  it('Ignores the separator if it is not at the boundary', () => {
    const expected = 'a|b|c||de|f';
    const actual = join('a|b', '|', '|c||de|f');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one separator even if the first part ends with it', () => {
    const expected = 'first,second';
    const actual = join('first,', ',', 'second');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one separator even if the second part starts with it', () => {
    const expected = 'first,second';
    const actual = join('first', ',', ',second');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one separator even if the first part ends with it and the second part starts with it', () => {
    const expected = 'first,second';
    const actual = join('first,', ',', ',second');
    expect(actual).toBe(expected);
  });

  it('Uses the separator if it is not present at the boundary', () => {
    const expected = 'first,second';
    const actual = join('first', ',', 'second');
    expect(actual).toBe(expected);
  });

});
