import { query } from '../src';
import { expect } from 'chai';

describe('query', () => {

  it('Returns empty string if there are no params', () => {
    const expected = '';
    const actual = query({});
    expect(actual).to.equal(expected);
  });

  it('Returns single key-value pair if one param is passed', () => {
    const expected = 'key=value';
    const actual = query({ key: 'value' });
    expect(actual).to.equal(expected);
  });

  it('Can handle multiple params', () => {
    const expected = 'p1=v1&p2=v2&p3=v3';
    const actual = query({ p1: 'v1', p2: 'v2', p3: 'v3' });
    expect(actual).to.equal(expected);
  });

  it('Escapes the value', () => {
    const expected = 'key=a+%22special%22+value';
    const actual = query({ key: 'a "special" value' });
    expect(actual).to.equal(expected);
  });

  it('Escapes the key', () => {
    const expected = 'a+%22special%22+key=value';
    const actual = query({ 'a "special" key': 'value' });
    expect(actual).to.equal(expected);
  });

});
