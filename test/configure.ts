import { describe, it, expect } from 'vitest';
import { configure } from '../src';

describe('configure', () => {
  it('Should create decorator for urlcat with a configuration', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c';
    const urlcat = configure({ objectFormat: { format: 'RFC1738' } })

    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c' });
    expect(actual).toBe(expected);
  });

  it('Should create decorator for urlcat and override with custom configuration configuration', () => {
    const expected = 'http://example.com/path/a%20b?q=b%20c';
    const urlcat = configure({ objectFormat: { format: 'RFC1738' } })

    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c' }, undefined, { objectFormat: { format: 'RFC3986' } });
    expect(actual).toBe(expected);
  });

  it('Should create decorator for urlcat with all configuration options', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c&c=foo&c=bar';
    const urlcat = configure({ objectFormat: { format: 'RFC1738' }, arrayFormat: 'repeat' })

    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c', c: ['foo', 'bar'] });
    expect(actual).toBe(expected);
  });

  it('Should create decorator for urlcat with all configuration options and override with custom configuration', () => {
    const expected = 'http://example.com/path/a%20b?q=b%20c&c=foo%2Cbar';
    const urlcat = configure({ objectFormat: { format: 'RFC1738' }, arrayFormat: 'repeat' })

    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c', c: ['foo', 'bar'] }, undefined, { arrayFormat: 'comma', objectFormat: { format: 'RFC3986' } });
    expect(actual).toBe(expected);
  });

  it('Creates a decorator that supports the 3-parameter overload', () => {
    const expected = 'http://example.com/path/1';
    const urlcat = configure({ objectFormat: { format: 'RFC1738' } })

    const actual = urlcat('http://example.com/', '/path/:p', { p: 1 });
    expect(actual).toBe(expected);
  });
});
