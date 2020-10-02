import urlcat from '../src';

describe('urlcat', () => {

  it('Concatenates the base URL and the path if no params are passed', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com', 'path');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one slash for joining even if the base URL has a trailing slash', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', 'path');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one slash for joining even if the path has a leading slash', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com', '/path');
    expect(actual).toBe(expected);
  });

  it('Uses exactly one slash for joining even if the base URL and the path both have a slash at the boundary', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path');
    expect(actual).toBe(expected);
  });

  it('Substitutes path parameters', () => {
    const expected = 'http://example.com/path/1';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 1 });
    expect(actual).toBe(expected);
  });

  it('Allows path parameters at the beginning of the path', () => {
    const expected = 'http://example.com/1';
    const actual = urlcat('http://example.com/', ':p', { p: 1 });
    expect(actual).toBe(expected);
  });

  it('Parameters that are missing from the path become query parameters', () => {
    const expected = 'http://example.com/path/1?q=2';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 1, q: 2 });
    expect(actual).toBe(expected);
  });

  it('Uses exactly one ? to join query parameters even if the path has a trailing question mark', () => {
    const expected = 'http://example.com/path?q=2';
    const actual = urlcat('http://example.com/', '/path?', { q: 2 });
    expect(actual).toBe(expected);
  });

  it('Removes trailing question mark from the path if no params are specified', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path?', {});
    expect(actual).toBe(expected);
  });

  it('All parameters become query parameters if the path has no parameters', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path?', {});
    expect(actual).toBe(expected);
  });

  it('If a parameter appears twice in the path, it is substituted twice', () => {
    const expected = 'http://example.com/path/a/b/a/r';
    const actual = urlcat('http://example.com/', '/path/:p1/:p2/:p1/r', { p1: 'a', p2: 'b' });
    expect(actual).toBe(expected);
  });

  it('Escapes both path and query parameters', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 'a b', q: 'b c' });
    expect(actual).toBe(expected);
  });

  it('Can handle complex URL\'s', () => {
    const expected = 'http://example.com/users/123/posts/987/comments?authorId=456&limit=10&offset=120';
    const actual = urlcat(
      'http://example.com/',
      '/users/:userId/posts/:postId/comments',
      { userId: 123, postId: 987, authorId: 456, limit: 10, offset: 120 }
    );
    expect(actual).toBe(expected);
  });

  it('Provides an overload (baseUrl, pathTemplate) that works correctly', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path');
    expect(actual).toBe(expected);
  });

  it('Handles "//" path correctly (reproduces #7)', () => {
    const expected = 'http://example.com//';
    const actual = urlcat('http://example.com/', '//');
    expect(actual).toBe(expected);
  });

  it('Provides an overload (baseTemplate, params) that works correctly', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c';
    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c' });
    expect(actual).toBe(expected);
  });

  it('Renders boolean (true) path params', () => {
    const expected = 'http://example.com/path/true';
    const actual = urlcat('http://example.com/path/:p', { p: true });
    expect(actual).toBe(expected);
  });

  it('Renders boolean (false) path params', () => {
    const expected = 'http://example.com/path/false';
    const actual = urlcat('http://example.com/path/:p', { p: false });
    expect(actual).toBe(expected);
  });

  it('Renders number path params', () => {
    const expected = 'http://example.com/path/456';
    const actual = urlcat('http://example.com/path/:p', { p: 456 });
    expect(actual).toBe(expected);
  });

  it('Renders string path params', () => {
    const expected = 'http://example.com/path/test';
    const actual = urlcat('http://example.com/path/:p', { p: 'test' });
    expect(actual).toBe(expected);
  });

  it('Ignores entirely numeric path params', () => {
    const expected = 'http://localhost:3000/path/test';
    const actual = urlcat('http://localhost:3000/path/:p', { p: 'test' });
    expect(actual).to.equal(expected);
  });

  it('Throws if a path param is an object', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: {} }))
      .toThrowError("Path parameter p cannot be of type object. Allowed types are: boolean, string, number.");
  });

  it('Throws if a path param is an array', () => {
    expect(() => urlcat('http://example.com/path/:p/:q', { p: [] }))
      .toThrowError("Path parameter p cannot be of type object. Allowed types are: boolean, string, number.");
  });

  it('Throws if a path param is a symbol', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: Symbol() }))
      .toThrowError("Path parameter p cannot be of type symbol. Allowed types are: boolean, string, number.");
  });

  it('Throws if a path param is undefined', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: undefined }))
      .toThrowError("Path parameter p cannot be of type undefined. Allowed types are: boolean, string, number.");
  });

  it('Throws if a path param is null', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: null }))
      .toThrowError("Path parameter p cannot be of type object. Allowed types are: boolean, string, number.");
  });

  it('Throws if a path param is an empty string', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: "" }))
      .toThrowError("Path parameter p cannot be an empty string.");
  });

  it('Throws if a path param contains only whitespace', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: "  " }))
      .toThrowError("Path parameter p cannot be an empty string.");
  });
});
