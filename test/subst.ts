import { subst } from '../src';
import { expect } from 'chai';

describe('subst', () => {

  it('Returns empty string if the template is empty and there are no params', () => {
    const expected = '';
    const actual = subst('', {});
    expect(actual).to.equal(expected);
  });

  it('Returns empty string if the template is empty but a param is passed', () => {
    const expected = '';
    const actual = subst('', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Returns the raw template if it has a param but none are passed', () => {
    const expected = '/:p';
    const actual = subst('/:p', {});
    expect(actual).to.equal(expected);
  });

  it('Only substitutes params that are present in the object passed', () => {
    const expected = '/1/:q';
    const actual = subst('/:p/:q', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Substitutes all params present in the object passed', () => {
    const expected = '/1/a/false';
    const actual = subst('/:p/:q/:r', { p: 1, q: 'a', r: false });
    expect(actual).to.equal(expected);
  });

  it('Allows parameters at the beginning of the template', () => {
    const expected = '42';
    const actual = subst(':p', { p: 42 });
    expect(actual).to.equal(expected);
  });

  it('Allowed Type boolean (true)  should be rendered', () => {
    const expected = 'true';
    const actual = subst(':p', { p: true });
    expect(actual).to.equal(expected);
  });

  it('Allowed Type boolean (false)  should be rendered', () => {
    const expected = 'false';
    const actual = subst(':p', { p: false });
    expect(actual).to.equal(expected);
  });

  it('Allowed Type string  should be rendered', () => {
    const expected = 'test';
    const actual = subst(':p', { p: 'test' });
    expect(actual).to.equal(expected);
  });

  it('Allowed Type Number should be rendered', () => {
    const expected = '234';
    const actual = subst(':p', { p: 234 });
    expect(actual).to.equal(expected);
  });

  it('Not Allowed Type Array should not be rendered', () => {
    expect(() => subst(':p', { p: [] }))
      .to.throw(TypeError, "Path parameter p cannot be of type object. Allowed types are: boolean, string, number.");
  });

  it('Not Allowed Type Object should not be rendered', () => {
    expect(() => subst(':p', { p: {} }))
      .to.throw(TypeError, "Path parameter p cannot be of type object. Allowed types are: boolean, string, number.");
  });

  it('Not Allowed Type Symbol should not be rendered', () => {
    expect(() => subst(':p', { p: Symbol() }))
      .to.throw(TypeError, "Path parameter p cannot be of type symbol. Allowed types are: boolean, string, number.");
  });
});
