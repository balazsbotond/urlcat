import { subst } from '../src';

describe('subst', () => {

  it('Returns empty string if the template is empty and there are no params', () => {
    const expected = '';
    const actual = subst('', {});
    expect(actual).toBe(expected);
  });

  it('Returns empty string if the template is empty but a param is passed', () => {
    const expected = '';
    const actual = subst('', { p: 1 });
    expect(actual).toBe(expected);
  });

  it('Substitutes all params present in the object passed', () => {
    const expected = '/1/a/false';
    const actual = subst('/:p/:q/:r', { p: 1, q: 'a', r: false });
    expect(actual).toBe(expected);
  });

  it('Allows parameters at the beginning of the template', () => {
    const expected = '42';
    const actual = subst(':p', { p: 42 });
    expect(actual).toBe(expected);
  });

  it('Renders boolean (true) params', () => {
    const expected = 'true';
    const actual = subst(':p', { p: true });
    expect(actual).toBe(expected);
  });

  it('Renders boolean (false) params', () => {
    const expected = 'false';
    const actual = subst(':p', { p: false });
    expect(actual).toBe(expected);
  });

  it('Renders string params', () => {
    const expected = 'test';
    const actual = subst(':p', { p: 'test' });
    expect(actual).toBe(expected);
  });

  it('Renders number params', () => {
    const expected = '234';
    const actual = subst(':p', { p: 234 });
    expect(actual).toBe(expected);
  });

  it('Throws if a param is an array', () => {
    expect(() => subst(':p', { p: [] }))
      .toThrowError('Path parameter p cannot be of type object. Allowed types are: boolean, string, number.');
  });

  it('Throws if a param is an object', () => {
    expect(() => subst(':p', { p: {} }))
      .toThrowError('Path parameter p cannot be of type object. Allowed types are: boolean, string, number.');
  });

  it('Throws if a param is a symbol', () => {
    expect(() => subst(':p', { p: Symbol() }))
      .toThrowError('Path parameter p cannot be of type symbol. Allowed types are: boolean, string, number.');
  });

  it('Throws if a param is missing', () => {
    expect(() => subst(':p', {})).toThrow();
  });
});
